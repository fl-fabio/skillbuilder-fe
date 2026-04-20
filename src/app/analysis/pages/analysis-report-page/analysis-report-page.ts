import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AgCharts } from 'ag-charts-angular';
import {
  AgChartOptions,
  AgDonutSeriesOptions,
  AgPolarChartOptions,
  AllCommunityModule,
  ModuleRegistry
} from 'ag-charts-community';
import { firstValueFrom } from 'rxjs';
import {
  AnalysisContainer,
  GapAnalysisResponse,
  TrainingPriority
} from '../../models/analysis.models';
import { AnalysisService } from '../../services/analysis.service';
import { AuthStorageService } from '../../../core/services/auth-storage.service';
import { getUserIdFromToken } from '../../../core/utils/jwt.utils';
import { AnalysisStateService } from '../../services/analysis-state.service';

interface CoverageChartDatum {
  label: string;
  value: number;
}

interface CoverageVisualTheme {
  primary: string;
  secondary: string;
  emphasis: string;
  accentSurface: string;
}

let agChartsModulesRegistered = false;

function ensureAgChartsModulesRegistered(): void {
  if (agChartsModulesRegistered) {
    return;
  }

  ModuleRegistry.registerModules(AllCommunityModule);
  agChartsModulesRegistered = true;
}

@Component({
  selector: 'app-analysis-report-page',
  standalone: true,
  imports: [RouterLink, AgCharts],
  templateUrl: './analysis-report-page.html',
  styleUrl: './analysis-report-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalysisReportPage {
  private readonly analysisService = inject(AnalysisService);
  private readonly analysisStateService = inject(AnalysisStateService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  constructor() {
    ensureAgChartsModulesRegistered();
  }

  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly report = signal<GapAnalysisResponse | null>(null);

  readonly analysis = computed<AnalysisContainer | null>(
    () => this.report()?.analysis ?? null
  );

  readonly coveragePercent = computed(() =>
    this.normalizeCoverageScore(this.analysis()?.summary.coverage_score ?? 0)
  );

  readonly coverageTone = computed<'critical' | 'warning' | 'good'>(() =>
    this.coverageToneFor(this.coveragePercent())
  );

  readonly coverageChartOptions = computed<AgChartOptions>(() =>
    this.buildCoverageChartOptions(this.coveragePercent())
  );

  readonly topTrainingPriorities = computed<TrainingPriority[]>(() =>
    [...(this.analysis()?.training_priorities ?? [])]
      .sort((left, right) => right.priority_score - left.priority_score)
      .slice(0, 5)
  );

  async ngOnInit(): Promise<void> {
    const submittedAnalysis = this.analysisStateService.submittedAnalysis();

    if (submittedAnalysis) {
      this.report.set(submittedAnalysis);
      this.isLoading.set(false);
      return;
    }

    const token = this.authStorage.getToken();

    if (!token) {
      await this.router.navigate(['/login']);
      return;
    }

    try {
      const userId = getUserIdFromToken(token);
      const response = await firstValueFrom(this.analysisService.getAnalysis(userId));
      this.analysisStateService.setSubmittedAnalysis(response);
      this.report.set(response);
    } catch (error) {
      if (isTokenError(error)) {
        this.authStorage.clearSession();
        await this.router.navigate(['/login']);
        return;
      }

      this.errorMessage.set('Impossibile caricare l’analisi. Riprova più tardi.');
    } finally {
      this.isLoading.set(false);
    }
  }

  formatCoverageScore(value: number): string {
    return `${Math.round(this.normalizeCoverageScore(value))}%`;
  }

  formatPercentage(value: number): string {
    return `${Math.round(this.clampPercentage(value))}%`;
  }

  formatPriorityScore(value: number): string {
    return value.toFixed(2);
  }

  formatTimestamp(value: string): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  }

  gapTone(gap: number): 'critical' | 'warning' | 'good' {
    if (gap > 30) {
      return 'critical';
    }

    if (gap >= 10) {
      return 'warning';
    }

    return 'good';
  }

  compatibilityTone(value: string): 'critical' | 'warning' | 'good' {
    const normalized = value.trim().toLowerCase();

    if (
      /alta|alto|high|strong|ottima|ottimo|elevata|excellent|good|forte|completa/.test(
        normalized
      )
    ) {
      return 'good';
    }

    if (
      /parziale|partial|moderata|moderato|medium|media|discreta|fair|intermedia/.test(
        normalized
      )
    ) {
      return 'warning';
    }

    if (
      /bassa|basso|low|scar|debole|limitat|poor|weak|critica|critical/.test(
        normalized
      )
    ) {
      return 'critical';
    }

    return 'warning';
  }

  private normalizeCoverageScore(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }

    const normalized = value <= 1 ? value * 100 : value;
    return this.clampPercentage(normalized);
  }

  private clampPercentage(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.max(0, Math.min(100, value));
  }

  private coverageToneFor(coveragePercent: number): 'critical' | 'warning' | 'good' {
    if (coveragePercent < 40) {
      return 'critical';
    }

    if (coveragePercent < 70) {
      return 'warning';
    }

    return 'good';
  }

  private coverageThemeFor(coveragePercent: number): CoverageVisualTheme {
    const tone = this.coverageToneFor(coveragePercent);

    if (tone === 'critical') {
      return {
        primary: '#c2410c',
        secondary: '#fde7da',
        emphasis: '#9a3412',
        accentSurface: '#fff4ed'
      };
    }

    if (tone === 'warning') {
      return {
        primary: '#b45309',
        secondary: '#fef3c7',
        emphasis: '#92400e',
        accentSurface: '#fffaf0'
      };
    }

    return {
      primary: '#0f766e',
      secondary: '#d1fae5',
      emphasis: '#115e59',
      accentSurface: '#f0fdfa'
    };
  }

  private buildCoverageChartOptions(coveragePercent: number): AgChartOptions {
    const theme = this.coverageThemeFor(coveragePercent);
    const chartData: CoverageChartDatum[] = [
      {
        label: 'Copertura',
        value: coveragePercent
      },
      {
        label: 'Residuo',
        value: Math.max(0, 100 - coveragePercent)
      }
    ];

    const donutSeries: AgDonutSeriesOptions<CoverageChartDatum> = {
      type: 'donut',
      data: chartData,
      angleKey: 'value',
      calloutLabelKey: 'label',
      innerRadiusRatio: 0.8,
      sectorSpacing: 3,
      fills: [theme.primary, theme.secondary],
      strokes: [theme.primary, theme.secondary],
      strokeWidth: 0,
      calloutLabel: {
        enabled: false
      },
      sectorLabel: {
        enabled: false
      },
      innerLabels: [
        {
          text: `${Math.round(coveragePercent)}%`,
          fontSize: 36,
          fontWeight: 700,
          color: theme.emphasis
        },
        {
          text: 'Copertura',
          fontSize: 11,
          fontWeight: 600,
          color: '#64748b',
          spacing: 4
        }
      ],
      tooltip: {
        renderer: params => ({
          title: String(params.datum.label),
          content: `${Math.round(Number(params.datum.value) || 0)}%`
        })
      }
    };

    const options: AgPolarChartOptions<CoverageChartDatum> = {
      background: {
        visible: false
      },
      padding: {
        top: 6,
        right: 6,
        bottom: 6,
        left: 6
      },
      series: [donutSeries],
      legend: {
        enabled: false
      }
    };

    return options;
  }
}

function isTokenError(error: unknown): boolean {
  return error instanceof Error && error.message === 'User ID not found in token';
}
