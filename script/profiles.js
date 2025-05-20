/********************************************************************
 PROFILES.JS - GESTIONE SELEZIONE E CANCELLAZIONE PROFILI UTENTE  
 Questo script consente:                                          
   - Visualizzazione ed interazione dei profili utente salvati    
   - Selezione del profilo corrente (per uso nell'app)            
   - Eliminazione di profili utente (tranne "Iscriviti")          
   - Navigazione a signup o index in base all'azione              
 ********************************************************************/

// ================================
// Caricamento utenti da localStorage
// ================================
// - Ottiene l'array dei profili utente (userIcons) dal localStorage.
// - Se non esiste, viene inizializzato come array vuoto.
// - Seleziona il contenitore HTML dove verranno mostrate le card profilo.

let userIcons = JSON.parse(localStorage.getItem("userIcons")) || [];
const userIconsContainer = document.querySelector('.profiles-container');

// ================================
// Funzione di creazione dei profili
// ================================
// - Svuota il contenitore profili.
// - Per ogni utente in userIcons:
//    - Crea una card profilo con immagine e nome.
//    - Aggiunge il bottone elimina (solo se non è "Iscriviti").
//    - Gestisce il click sulla card (seleziona profilo o va a signup).
//    - Gestisce il click su elimina (rimuove il profilo, aggiorna localStorage e ri-renderizza).

function gestoreProfili() {
    userIconsContainer.innerHTML = ''; // Svuota il contenitore

    userIcons.forEach(user => {
        // Crea una card per ogni profilo
        const profileCard = document.createElement('div');
        profileCard.classList.add('profile-card');

        // Bottone elimina profilo (solo per utenti reali)
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Elimina profilo';

        // Inserisce immagine e nome nella card
        profileCard.innerHTML = `
            <img src="${user.icona}" alt="${user.utente}">
            <p>${user.utente}</p>
        `;
        // Aggiungi bottone elimina solo se non è "Iscriviti"
        if (user.utente !== "Iscriviti") {
            profileCard.appendChild(deleteButton); 
        }
        userIconsContainer.appendChild(profileCard);

        // === Gestione click sulla card profilo ===
        profileCard.addEventListener('click', () => {
            if (user.utente === "Iscriviti") {
                // Se "Iscriviti", reindirizza alla pagina di registrazione
                window.location.href = 'signup.html';
                return;
            }
            // Salva profilo selezionato su localStorage
            localStorage.setItem('selectedUser', JSON.stringify(user));
            // Calcola e salva utenti rimanenti (escludendo utente selezionato ed in uso e card "Iscriviti")
            const remainingUsers = userIcons.filter(u => u.utente !== user.utente && u.utente !== "Iscriviti");
            localStorage.setItem('remainingUsers', JSON.stringify(remainingUsers));
            // Reindirizza alla home
            window.location.href = 'index.html';
        });

        // === Gestione click su bottone elimina profilo ===
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Evita propagazione per non attivare anche il click sulla card
            const index = userIcons.findIndex(u => u.utente === user.utente);
            if (index !== -1) {
                userIcons.splice(index, 1); // Rimuovi utente dall'array in posizione index e solo un elemento
                localStorage.setItem('userIcons', JSON.stringify(userIcons)); // Aggiorna localStorage
                gestoreProfili(); // Rirenderizza la lista aggiornata!
            }
        });
    });
}

//================================
//Rendering iniziale dei profili
//================================
//- Al caricamento del file, mostra subito la lista dei profili.
//
gestoreProfili();