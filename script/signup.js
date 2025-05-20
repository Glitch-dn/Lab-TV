/*********************************************************************
 * SIGNUP.JS - GESTIONE REGISTRAZIONE NUOVO UTENTE
 * Permette la scelta dell'icona, ora correttamente associata all'utente
 *********************************************************************/

// Recupera il riferimento al form di registrazione tramite ID
const form = document.getElementById('signup-form');

// Recupera tutti gli input all'interno del form (inclusi quelli radio)
const inputs = form.querySelectorAll('input');

// Classe User per rappresentare un utente
class User {
    // Il costruttore riceve il nome utente e il percorso dell'icona selezionata
    constructor(utente, icona) {
        this.utente = utente; // Nome utente
        this.icona = icona;   // Percorso immagine icona utente
    }
}

// Listener per l'evento di invio del form (submit)
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Previene il comportamento predefinito (reload della pagina)

    // === Validazione dei campi obbligatori ===
    let valid = true;
    // Cicla su tutti gli input tranne i radio per verificare che non ci siano campi vuoti o errati
    inputs.forEach(input => {
        if (input.type !== 'radio') {
            // Verifica campo vuoto
            if (input.value.trim() === '') {
                alert('Per favore, compila tutti i campi.');
                valid = false;
                return;
            }
            // Verifica formato email valido con una regex base
            if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) {
                alert('Per favore, inserisci un indirizzo email valido.');
                valid = false;
                return;
            }
            // Verifica formato numero di telefono reale (italiano, spazi e trattini ammessi, con o senza +39)
            // La regex accetta: +39 3331234567, 3331234567, 03331234567, +39 06 1234567, 06-1234567 ecc.
            if (
                input.type === 'tel' &&
                !/^(?:\+39)?\s?(3\d{2}|0\d{1,3})[\s\-]?\d{6,7}$/.test(input.value.trim())
            ) {
                alert('Per favore, inserisci un numero di telefono valido.');
                valid = false;
                return;
            }
            // Verifica password: almeno 6 caratteri, una maiuscola e un numero
            if (input.type === 'password' && !/(?=.*[A-Z])(?=.*\d).{6,}/.test(input.value)) {
                alert('La password deve essere lunga almeno 6 caratteri, contenere almeno un numero e una lettera maiuscola.');
                valid = false;
                return;
            }
            // Verifica formato CAP italiano valido (5 cifre) senza spazi o trattini
            if (
                input.name === 'zip' &&
                !/^\d{5}$/.test(input.value.trim())
            ) {
                alert('Per favore, inserisci un CAP italiano valido di 5 cifre.');
                valid = false;
                return;
            }
        }
    });
    // Blocca la registrazione se la validazione fallisce
    if (!valid) return;

    // === Recupera il valore dell'icona selezionata tra i radio ===
    // Usa querySelector per trovare il radio selezionato (checked) con name="profile-icon"
    const selectedIcon = form.querySelector('input[name="profile-icon"]:checked').value;

    // === Carica utenti esistenti dal localStorage (array userIcons) ===
    // Se non esiste ancora, parte da array vuoto
    let userIcons = JSON.parse(localStorage.getItem('userIcons')) || [];

    // === Crea nuovo utente utilizzando il nome utente inserito e l'icona selezionata ===
    // inputs[0] si riferisce al primo campo input del form, cioè il nome utente
    const newUser = new User(inputs[0].value, selectedIcon);

    // === Inserisci il nuovo utente nell'array userIcons ===
    // Se esiste già la voce "Iscriviti", inserisce il nuovo utente prima di essa, altrimenti lo aggiunge in fondo
    const iscrivitiIndex = userIcons.findIndex(u => u.utente === "Iscriviti");
    if (iscrivitiIndex === -1) {
        // Non c'è "Iscriviti": aggiungi nuovo utente e anche la voce "Iscriviti"
        userIcons.push(newUser);
        userIcons.push({ utente: "Iscriviti", icona: "../LabTV-Loghi/add-contact.png" });
    } else {
        // Inserisci nuovo utente subito prima di "Iscriviti" senza rimuovere nulla
        userIcons.splice(iscrivitiIndex, 0, newUser);
    }

    // === Aggiorna il localStorage con il nuovo array userIcons ===
    // Serve per conservare i profili anche dopo il refresh della pagina
    localStorage.setItem('userIcons', JSON.stringify(userIcons));

    // === Salva anche il nuovo utente come utente selezionato di default ===
    // Utile per mostrarlo come profilo attivo dopo la registrazione
    localStorage.setItem('selectedUser', JSON.stringify(newUser));

    // === Reindirizza l'utente alla pagina dei profili, ora che la registrazione è avvenuta ===
    window.location.href = 'profiles.html';
});