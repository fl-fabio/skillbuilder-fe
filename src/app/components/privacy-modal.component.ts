import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="isOpen" class="modal-overlay" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="close-button" (click)="closeModal()" aria-label="Close modal">&times;</button>
        <h2><strong>Informativa sul Trattamento dei Dati Personali</strong></h2>

<p>
Ai sensi del Regolamento (UE) 2016/679 (“GDPR”), si informa che i dati personali forniti
dall’utente saranno trattati nel rispetto dei principi di liceità, correttezza, trasparenza e tutela della
riservatezza.
</p>

<ol>
    <li>
        <strong>Titolare del trattamento</strong><br>
        Il Titolare del trattamento è Fabio Lanzafame contattabile all’indirizzo email 
        <a href="mailto:fabio.lanzafame0308@gmail.com">fabio.lanzafame0308@gmail.com</a>.
    </li>

    <li>
        <strong>Finalità del trattamento</strong><br>
        I dati personali raccolti saranno trattati esclusivamente per finalità di orientamento formativo,
        ovvero per:
        <ul>
            <li>analizzare il profilo dello studente</li>
            <li>individuare e proporre corsi di formazione coerenti con le esigenze espresse</li>
        </ul>
    </li>

    <li>
        <strong>Base giuridica del trattamento</strong><br>
        Il trattamento si basa sul consenso esplicito dell’interessato, ai sensi dell’art. 6, par. 1, lett. a) del GDPR.
    </li>

    <li>
        <strong>Modalità del trattamento</strong><br>
        I dati saranno trattati con strumenti informatici e/o cartacei, adottando misure tecniche e
        organizzative adeguate a garantirne la sicurezza e la riservatezza.
    </li>

    <li>
        <strong>Natura del conferimento</strong><br>
        Il conferimento dei dati è facoltativo, ma il mancato consenso comporterà l’impossibilità di fornire
        un servizio di orientamento personalizzato.
    </li>

    <li>
        <strong>Comunicazione e diffusione dei dati</strong><br>
        I dati personali non saranno venduti, ceduti o diffusi a terzi per finalità commerciali. Potranno
        essere condivisi esclusivamente con soggetti incaricati del trattamento per le finalità sopra indicate.
    </li>

    <li>
        <strong>Periodo di conservazione</strong><br>
        I dati saranno conservati per il tempo strettamente necessario al raggiungimento delle finalità
        indicate e, comunque, non oltre <strong>[specificare periodo, es. 12 mesi]</strong>, salvo obblighi di legge.
    </li>

    <li>
        <strong>Diritti dell’interessato</strong><br>
        L’interessato ha il diritto di:
        <ul>
            <li>accedere ai propri dati personali</li>
            <li>richiederne la rettifica o la cancellazione</li>
            <li>limitare o opporsi al trattamento</li>
            <li>revocare il consenso in qualsiasi momento</li>
            <li>proporre reclamo all’Autorità Garante per la protezione dei dati personali</li>
        </ul>
    </li>
</ol>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1050;
    }

    .modal-content {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      overflow-y: auto;
      width: 600px;
      color: #333;
    }

    .close-button {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: transparent;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      cursor: pointer;
      color: #888;
    }
  `]
})
export class PrivacyModalComponent {
  @Input() isOpen = false;
  @Output() modalClose = new EventEmitter<void>();

  closeModal(): void {
    this.modalClose.emit();
  }
}