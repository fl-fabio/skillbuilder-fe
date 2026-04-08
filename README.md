# Users CRUD

## Descrizione del Progetto

Questo progetto è un'applicazione web per la gestione di utenti (CRUD: Create, Read, Update, Delete) sviluppata con Angular. L'app permette di visualizzare una lista di utenti, vedere i dettagli di un singolo utente, modificare le informazioni di un utente e eliminarlo. I dati degli utenti sono fittizi e provengono da un'API esterna chiamata JSONPlaceholder, che fornisce dati di esempio per lo sviluppo e i test.

L'applicazione è pensata per principianti che vogliono imparare Angular e le operazioni CRUD. È strutturata in modo semplice e modulare, utilizzando componenti standalone, servizi per la gestione dei dati e routing per la navigazione tra le pagine.

### Cosa significa CRUD?
- **Create**: Creare un nuovo utente (non implementato in questa versione, ma la struttura è pronta).
- **Read**: Leggere e visualizzare gli utenti esistenti.
- **Update**: Modificare le informazioni di un utente esistente.
- **Delete**: Eliminare un utente.

## Caratteristiche Principali

- **Lista Utenti**: Pagina principale che mostra tutti gli utenti in una lista con schede informative.
- **Dettagli Utente**: Pagina per vedere tutte le informazioni di un singolo utente, inclusi indirizzo e azienda.
- **Modifica Utente**: Form per aggiornare i dati di un utente esistente.
- **Eliminazione Utente**: Possibilità di cancellare un utente dalla lista.
- **Gestione Errori**: L'app gestisce gli errori di caricamento e salvataggio, mostrando messaggi all'utente.
- **Stati di Caricamento**: Indicatori visivi durante le operazioni asincrone (caricamento, salvataggio, eliminazione).
- **Responsive**: L'interfaccia è adattabile a diversi dispositivi.

## Prerequisiti

Prima di iniziare, assicurati di avere installato sul tuo computer:

- **Node.js** (versione 18 o superiore): Puoi scaricarlo da [nodejs.org](https://nodejs.org/).
- **npm** (viene installato automaticamente con Node.js): È il gestore di pacchetti per JavaScript.
- Un browser web moderno (Chrome, Firefox, Safari, Edge).

Non è necessario avere conoscenze avanzate di programmazione, ma una base di HTML, CSS e JavaScript/TypeScript aiuta.

## Installazione

1. **Clona o scarica il progetto**: Se hai Git installato, apri il terminale e digita:
   ```
   git clone [URL del repository]
   ```
   Altrimenti, scarica il file ZIP e estrailo.

2. **Entra nella cartella del progetto**:
   ```
   cd users-crud
   ```

3. **Installa le dipendenze**:
   ```
   npm install
   ```
   Questo comando scarica tutte le librerie necessarie (Angular, RxJS, ecc.).

## Come Usare l'Applicazione

1. **Avvia il server di sviluppo**:
   ```
   npm start
   ```
   Oppure:
   ```
   ng serve
   ```
   L'app sarà disponibile su `http://localhost:4200/`.

2. **Naviga nell'app**:
   - Apri il browser e vai a `http://localhost:4200/`.
   - Vedrai la lista degli utenti.
   - Clicca su un utente per vedere i dettagli.
   - Dalla pagina dettagli, puoi modificare o eliminare l'utente.

3. **Modificare un utente**:
   - Nella pagina dettagli, clicca su "Modifica".
   - Compila il form con le nuove informazioni.
   - Clicca "Salva" per aggiornare.

4. **Eliminare un utente**:
   - Nella pagina dettagli, clicca su "Elimina".
   - Conferma l'eliminazione.

Nota: Poiché usa dati fittizi, le modifiche non vengono salvate permanentemente. L'API JSONPlaceholder simula le operazioni ma non le memorizza.

## Struttura del Progetto

Il progetto è organizzato in cartelle logiche:

- `src/app/`:
  - `components/`: Componenti riutilizzabili come `user-card` (scheda utente) e `user-form` (form per utenti).
  - `models/`: Definizioni dei tipi di dati, come `User` e `UserFormValue`.
  - `pages/`: Pagine principali: `users-home-page` (lista), `user-detail-page` (dettagli), `user-edit-page` (modifica).
  - `routes/`: Configurazione delle rotte per la navigazione.
  - `services/`: Logica di business: `users-api.service` (comunicazione con l'API), `user.service` (gestione utenti con stati).
  - `app.config.ts`: Configurazione principale dell'app (routing, HTTP client).
  - `app.routes.ts`: Definizione delle rotte principali.

- `public/`: File statici come immagini o favicon.
- `package.json`: Configurazione del progetto e dipendenze.

## Tecnologie Utilizzate

- **Angular 21**: Framework per costruire applicazioni web single-page (SPA).
- **TypeScript**: Linguaggio di programmazione che aggiunge tipi a JavaScript.
- **RxJS**: Libreria per gestire operazioni asincrone e flussi di dati.
- **Angular Forms**: Per gestire i form di input.
- **Angular Router**: Per la navigazione tra pagine.
- **JSONPlaceholder**: API gratuita per dati fittizi.
- **SCSS**: Per gli stili CSS avanzati.

## Comandi Utili

- `npm start` o `ng serve`: Avvia il server di sviluppo.
- `npm run build` o `ng build`: Costruisce l'app per la produzione.
- `npm test` o `ng test`: Esegue i test unitari.
- `ng generate component nome-componente`: Crea un nuovo componente.
- `ng generate service nome-service`: Crea un nuovo servizio.

## Come Funziona Internamente (per Curiosi)

- **Componenti Standalone**: Ogni componente è indipendente e può essere usato da solo.
- **Servizi**: Gestiscono la logica di business e la comunicazione con l'API.
- **Signals**: Nuove funzionalità di Angular per gestire lo stato reattivo (come `isLoading`, `error`).
- **Routing**: Le URL cambiano in base alla pagina (es. `/` per la home, `/1` per l'utente con ID 1).
- **HTTP Client**: Per fare richieste GET, PUT, DELETE all'API esterna.

## Risoluzione Problemi

- Se `npm install` fallisce, assicurati di avere una connessione internet e Node.js aggiornato.
- Se l'app non si avvia, controlla che la porta 4200 non sia occupata da un'altra app.
- Per errori nell'app, apri la console del browser (F12) per vedere i messaggi di errore.

## Prossimi Passi

Questa è una versione base. Puoi estenderla aggiungendo:
- Creazione di nuovi utenti.
- Autenticazione e login.
- Database reale invece di API fittizia.
- Test più completi.

Buon apprendimento con Angular!

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
