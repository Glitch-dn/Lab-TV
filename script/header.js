/***********************************************************************
 * HEADER.JS - GESTIONE HEADER, PROFILI E MENU
 * - Interattività della barra header: profili, ricerca, menu, news
 * - Le icone e i nomi profilo si scambiano sempre in modo sincronizzato
 * - La barra di ricerca si richiude al primo scroll dopo apertura
 **********************************************************************/

//=======================
//Inizializzazione utenti di default su localStorage
//=========================
const userIconsBase = [
  { utente: "Califano",   icona: "LabTV-Loghi/profile1.png" },
  { utente: "Fragola86",  icona: "LabTV-Loghi/profile2.png" },
  { utente: "Banana33",   icona: "LabTV-Loghi/profile3.png" },
  { utente: "Iscriviti",  icona: "LabTV-Loghi/add-contact.png" }
];
// Se in localStorage non c'è la chiave "userIcons", la inizializza con i profili base
if (!localStorage.getItem("userIcons")) {
  localStorage.setItem("userIcons", JSON.stringify(userIconsBase));
}

//===============================
//Funzione di utilità: restituisce la stringa "vera" dell'immagine dal css perchè risolvere bug delle icone impazzite e ripetute, e concatenazione di url(url(...)) dovuto a jQuery
//===============================
function estraiImageUrl(str) {
  if (!str) return "";//Controllo se la stringa è vuota
  return str.replace(/^url\((['"]?)(.+?)\1\)$/, '$2');//Applico un metodo replace con una espressione regolare per “ripulire” la stringa in ingresso.
}

//=======================
//Click sul logo: torna alla home
//======================= */
$(".logo").click(function () {
  window.location.href = "index.html"; // Al click sul logo reindirizza alla home
});

// =======================
//Barra di ricerca: apertura manuale e chiusura automatica su scroll (in fondo)
//======================= 
let searchBarOpenedByUser = false; // Flag per sapere se la barra è stata aperta dall'utente

// Click sulla prima icona del profilo apre/chiude la barra di ricerca
$(".profile-icons .icon").eq(0).click(function () {
  $(".toggle-element").not("#input-bar1").fadeOut(300); // Chiude altri menu aperti
  const inputBar = $("#input-bar1");
  inputBar.animate({ width: "toggle" }, 300, function () {
    if (inputBar.is(":visible")) {
      inputBar.find("input").focus();// Porta il cursore dentro la barra input
      searchBarOpenedByUser = true; // Segna che la barra è stata aperta manualmente
    } else {
      searchBarOpenedByUser = false; // Segna che la barra è stata chiusa
    }
  });
});

// MENU NEWS
// Click sulla seconda icona del profilo apre/chiude il menu delle news
$(".profile-icons .icon").eq(1).click(function () {
  $(".toggle-element").not("#menu1").fadeOut(300);//transizione visiva in cui un elemento gradualmente scompare
  $("#menu1").fadeToggle(300);//transizione visiva in cui un elemento gradualmente appare
});

// MENU PROFILI
// Click sulla terza icona del profilo apre/chiude il menu dei profili
$(".profile-icons .icon").eq(2).click(function () {
  $(".toggle-element").not("#menu2").fadeOut(300);
  $("#menu2").fadeToggle(300);
});

/* =======================
* Chiudi menu news/profili quando il mouse esce
* ======================= */
// Al mouseleave dei menu, questi vengono nascosti con fade out
$("#menu1").mouseleave(function () {
  $(this).fadeOut(300);
});
$("#menu2").mouseleave(function () {
  $(this).fadeOut(300);
});

//====================================================
//SCELTA E SWAP PROFILI NELL'HEADER
//- aggiorna sia l'immagine che il nome nel menu2
//==================================================== 
$(document).ready(function () {
  // Recupera il profilo selezionato e la lista profili da localStorage
  let selectedUser = JSON.parse(localStorage.getItem('selectedUser'));
  let userIcons = JSON.parse(localStorage.getItem('userIcons')) || [];

  // "Iscriviti" sempre in fondo: sposta l'oggetto "Iscriviti" in fondo all'array se presente, altrimenti lo aggiunge
  const iscrivitiIndex = userIcons.findIndex(user => user.utente === "Iscriviti");
  if (iscrivitiIndex !== -1) {
    userIcons.push(userIcons.splice(iscrivitiIndex, 1)[0]);//userIcons.splice(iscrivitiIndex, 1) rimuove l’oggetto "Iscriviti" dalla sua posizione attuale nell’array e lo restituisce come array con un elemento. questo per riordinare l'array ed evitere che iscriviti venga visualizzato prima di un nuovo utente
  } else {
    userIcons.push({ utente: "Iscriviti", icona: "../LabTV-Loghi/add-contact.png" }); // Se manca lo aggiunge
  }

  // Profili disponibili (tolto quello selezionato): array dei profili non attivi e diversi da "Iscriviti"
  let remainingUsers = userIcons.filter(user => user.utente !== "Iscriviti" && (!selectedUser || user.utente !== selectedUser.utente));

  // Mostra l’icona del profilo attivo nell'header principale
  const mainIcon = $("#profile");
  if (selectedUser) {
    mainIcon.css("background-image", `url(${selectedUser.icona})`); // Imposta immagine profilo
    mainIcon.attr("data-utente", selectedUser.utente); // Salva il nome utente come attributo
  } else {
    const firstUser = userIcons.find(u => u.utente !== "Iscriviti"); // Seleziona il primo utente disponibile
    if (firstUser) {
      mainIcon.css("background-image", `url(${firstUser.icona})`);
      mainIcon.attr("data-utente", firstUser.utente);
    }
  }

  // Costruisci il menu dei profili cliccabili (menu2)
  const menu2 = $("#menu2 ul");
  menu2.empty(); // Svuota elementi precedenti
  remainingUsers.forEach(user => {
    const listItem = $(`
      <li>
        <a href="#">
          <div class="iconBack" data-utente="${user.utente}" style="background-image: url(${user.icona});"></div>
          <p>${user.utente}</p>
        </a>
      </li>
    `);
    menu2.append(listItem); // Aggiunge ogni profilo al menu
  });
  // Aggiungi sempre "Iscriviti" in fondo al menu profili
  const addContactItem = $(`
    <li>
      <a href="#">
        <div class="iconBack" data-utente="Iscriviti" style="background-image: url('../LabTV-Loghi/add-contact.png');"></div>
        <p>Iscriviti</p>
      </a>
    </li>
  `);
  menu2.append(addContactItem);

  // Cambio profilo o click su "Iscriviti"
  menu2.on("click", "li", function () {
    const clickedIcon = $(this).find(".iconBack");
    const clickedUser = clickedIcon.attr("data-utente"); // Nome profilo cliccato

    if (clickedUser === "Iscriviti") {
      window.location.href = "signup.html"; // Se clicchi "Iscriviti" vai alla pagina di registrazione
      return;
    }

    // Dati attuali del profilo attivo
    const mainIconImg = estraiImageUrl(mainIcon.css("background-image")); // Ottiene url immagine profilo attivo
    const mainIconUser = mainIcon.attr("data-utente"); // Nome utente attivo

    // Dati del profilo cliccato
    const clickedIconImg = estraiImageUrl(clickedIcon.css("background-image")); // Ottiene url immagine profilo cliccato
    const clickedUserName = clickedUser; // Nome profilo cliccato

    // SWAP immagine e nome: aggiorna profilo attivo e quello cliccato
    mainIcon.css("background-image", `url(${clickedIconImg})`);
    mainIcon.attr("data-utente", clickedUserName);

    clickedIcon.css("background-image", `url(${mainIconImg})`);
    clickedIcon.attr("data-utente", mainIconUser);

    // AGGIORNA i nomi visualizzati nel menu
    $(this).find("p").text(mainIconUser);

    // Aggiorna localStorage con i nuovi dati dei profili
    const updatedSelectedUser = {
      icona: clickedIconImg,
      utente: clickedUserName,
    };

    // Aggiorna l'array userIcons con i nuovi dati dei profili
    userIcons = userIcons.map(user => {
      if (user.utente === mainIconUser) {
      // Se il profilo corrisponde a quello attualmente attivo, aggiorna con i nuovi dati
      return { utente: mainIconUser, icona: mainIconImg };
      } else if (user.utente === updatedSelectedUser.utente) {
      // Se il profilo corrisponde a quello appena selezionato, aggiorna con i nuovi dati
      return updatedSelectedUser;
      }
      // Mantieni invariati gli altri profili
      return user;
    });

    localStorage.setItem('selectedUser', JSON.stringify(updatedSelectedUser));
    localStorage.setItem('userIcons', JSON.stringify(userIcons));
  });
});

/* =========================================================
* NEWS DINAMICHE NEL MENU1
* ========================================================= */
// Array di oggetti con url immagine e messaggio della news
const imagesArray = [
  { nome: "Avoc", url: "https://dnm.nflximg.net/api/v6/dGKhUGb9YF21yyDjKrWwmGN1H8o/AAAABbPAk1SRAOyZCp0XSX9YIuvqpbYOyR8GdepPr1KCx5a4Mhw47hn-giaSlvAmwcM9my_aOQtOgA73QD2B6R0QFZyT5G3Zt6bbSQrMo_cX3NV49TQCawaZ_73UnODFI0Mld9_XSUN6xhRrin4.jpg?r=83e", msg: "Tom Hardy sfida la corruzione in città, ora arriva l'adrenalina" },
  { nome: "Pop the Baloon", url: "https://dnm.nflximg.net/api/v6/dGKhUGb9YF21yyDjKrWwmGN1H8o/AAAABZOl8my535VArST09UvHfC4CbH4lnrKIVlAiFQjIjRrHiAytC1Q2D3dxHJuR60yvZtOer8yuL_9p8vtmXMAgpVkpFxiyvuD-UCRdOHfStl3p4W2cQ8G8UWFmcl_hUjSAC5_UiPjgjxt4BKY.jpg?r=62f", msg: "Un gioco di abilità e strategia che ti farà divertire con gli amici" }
];
// Seleziona tutti gli elementi news nel menu1
const newsDivs = $("#menu1 .news");
newsDivs.each(function (index) {
  const { url: newsImage, msg: newsMessage } = imagesArray[index];
  $(this).css("background-image", `url("${newsImage}")`); // Imposta immagine di sfondo per la news
  $(this).next("p").text(newsMessage); // Imposta il testo della news
});

//=========================================================
//HEADER DINAMICO: sfondo che cambia opacità + chiusura barra ricerca
//========================================================= */
// Allo scroll della pagina cambia opacità dell'header e chiude la barra di ricerca se era stata aperta manualmente
$(window).on("scroll", function () {
  const scrollTop = $(window).scrollTop(); // Prende la posizione dello scroll
  const maxScroll = 300; // Scroll massimo per opacità massima
  const opacity = Math.min(1, scrollTop / maxScroll); // Calcola opacità proporzionale, La funzione Math.min() restituisce il valore più piccolo tra i suoi argomenti.
  //In questo caso, garantisce che il valore di opacità non superi mai 1, anche se scrollTop è maggiore di maxScroll.
  $(".main-header").css(
    "background-color",
    `rgba(21, 21, 21, ${opacity})`
  );

  // Chiudi la barra ricerca solo se è stata aperta dall’utente (una volta)
  const inputBar = $("#input-bar1");
  if (inputBar.is(":visible") && searchBarOpenedByUser) {
    inputBar.animate({ width: "toggle" }, 300); // Chiude la barra
    searchBarOpenedByUser = false; // Resetta il flag
  }
});

/* =======================
* FINE GESTIONE HEADER
* ======================= */