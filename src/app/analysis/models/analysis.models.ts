export interface GapAnalysisResponse {
  analysis: AnalysisContainer;
}

export interface AnalysisContainer {
  metadata: AnalysisMetadata;
  target: AnalysisTarget;
  summary: AnalysisSummary;
  skills: AnalysisSkill[];
  training_priorities: TrainingPriority[];
}

export interface AnalysisMetadata {
  timestamp: string;
}

export interface AnalysisTarget {
  job_title: string;
  area_name: string;
}

export interface AnalysisSummary {
  coverage_score: number;
  compatibility: string;
}

export interface AnalysisSkill {
  skill_name: string;
  user_level_pct: number;
  gap_pct: number;
}

export interface TrainingPriority {
  skill_name: string;
  gap_pct: number;
  expected_level: number;
  priority_score: number;
}
