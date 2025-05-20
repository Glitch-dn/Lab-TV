// hero.js - Gestione Hero Banner con autoplay, navigazione manuale, pallini e trailer

const movies = [
  {
      url: "https://images.hdqwalls.com/download/2022-the-matrix-resurrections-10k-xe-1920x1080.jpg",
      nome: "matrix resurrection",
      sinossi: "Il film esplora il ritorno di Neo e Trinity nel mondo di Matrix, le ragioni della loro resurrezione e il nuovo piano dell'Analista, un programma che ha preso il controllo di questa nuova versione della Matrice.",
      rating: (Math.random() * (10 - 7) + 7).toFixed(1)
  },
  {
      url: "https://images.hdqwalls.com/download/star-wars-the-rise-of-skywalker-12k-cn-1920x1080.jpg",
      nome: "Star Wars: l'ascesa di Skywalker",
      sinossi: "Dopo la vittoria della Resistenza su Crait, Rey continua il suo addestramento Jedi sotto la guida di Leia Organa. Nel frattempo, Kylo Ren ottiene un artefatto Sith che lo conduce al pianeta nascosto di Exegol, dove scopre che l'Imperatore Palpatine è tornato e sta segretamente ricostruendo il suo potere. Palpatine offre a Kylo un'armata di Star Destroyer Sith in cambio dell'uccisione di Rey.",
      rating: (Math.random() * (10 - 7) + 7).toFixed(1)
  },
  {
      url: "https://images.hdqwalls.com/download/peaky-blinders-7h-1920x1080.jpg",
      nome: "peaky blinders",
      sinossi: "La trama di Peaky Blinders è incentrata su una famiglia di gangster: gli Shelby. Sono loro i famosi “Peaky Blinders”. A capo del gruppo c'è Thomas o Tommy, che è tornato da poco dalla guerra e ne subisce ancora le conseguenze, divorato dagli incubi e permeato da un atteggiamento disilluso.",
      rating: (Math.random() * (10 - 7) + 7).toFixed(1)
  },
  {
      url: "https://images.hdqwalls.com/download/daredevil-x-kingpin-2025-1a-1920x1080.jpg",
      nome: "daredevil",
      sinossi: "Hell's Kitchen. L'avvocato Matt Murdock, dopo aver perso la vista da bambino a causa di un incidente radioattivo, sviluppa dei sensi sovrumani e li utilizza per combattere il crimine per le strade della sua città nei panni del supereroe Daredevil.",
      rating: (Math.random() * (10 - 7) + 7).toFixed(1)
  },
  {
      url: "https://images.hdqwalls.com/download/2025-mission-impossible-the-final-reckoning-85-1920x1080.jpg",
      nome: "mission impossible final reckoning",
      sinossi: "The Final Reckoning è una continua corsa contro il tempo, contro i limiti dell'umano, contro le storture di un mondo che, secondo McQuarrie e Cruise, si sta affidando troppo all'artificiale dimenticando le potenzialità - fisiche sì, ma prima di tutto morali e sentimentali - della natura umana.",
      rating: (Math.random() * (10 - 7) + 7).toFixed(1)
  },
  {
      url: "https://images.hdqwalls.com/download/stranger-things-5k-mv-1920x1080.jpg",
      nome: "strangers things",
      sinossi: "6 novembre 1983, Hawkins, Indiana. In un laboratorio segreto uno sconosciuto scienziato scappa da una misteriosa creatura, finendo tragicamente la sua corsa in un ascensore. Poco dopo Will, un ragazzino di 12 anni, scompare nel nulla dopo essere tornato a casa da una partita di D&D coi suoi amici, Mike, Dustin e Lucas.",
      rating: (Math.random() * (10 - 7) + 7).toFixed(1)
  }
];

let currentIndex = 0;
let sliderInterval = null;
const HERO_INTERVAL = 5000;

// =====================
// VARIABILI E FUNZIONI GLOBALI
// =====================
window.isTrailerPlaying = false;
window.heroMoviesArray = movies;
window.isHeroSliderAvailable = function() { return window.isTrailerPlaying; };

// Ridefinisco la funzione globale per chiudere il trailer hero
window.closeHeroTrailer = function() {
  const heroVideo = document.querySelector('.hero-video');
  const heroImage = document.querySelector('.hero-image');
  const heroButton = document.querySelector('.cta-button');
  if (heroVideo) { heroVideo.src = ''; heroVideo.style.display = 'none'; }
  if (heroImage) heroImage.style.display = 'block';
  if (heroButton) heroButton.textContent = '▶';
  window.isTrailerPlaying = false;
  // Riavvio autoplay se necessario
  avviaAutoplayHero();
};

// Funzione alternativa per compatibilità (alias)
window.chiudiTrailerHero = window.closeHeroTrailer;

// Avvia o riavvia lo slider hero (usato anche da altri script)
window.avviaHeroBanner = function(sourceMovies) {
  clearInterval(sliderInterval); 
  sliderInterval = setInterval(() => prossimaSlideHero(), HERO_INTERVAL);
  vaiASlide(currentIndex); 
};

// =====================
// SELEZIONE ELEMENTI DOM
// =====================
const heroButton = document.querySelector('.cta-button');
const heroArrowLeft = document.querySelector('.hero-arrow-left');
const heroArrowRight = document.querySelector('.hero-arrow-right');
const dotsContainer = document.querySelector('.hero-dots');

// =====================
// FUNZIONI PRINCIPALI DELLO SLIDER
// =====================

function mostraSlideHero(n) {
  const idx = (n + movies.length) % movies.length; 
  const heroImage = document.querySelector('.hero-image');
  const heroTitle = document.querySelector('.hero-banner h1');
  const heroRating = document.querySelector('.hero-banner p');
  const heroDescription = document.querySelector('.hero-banner article');
  const currentMovie = movies[idx];

  heroImage.classList.add('hidden');
  heroTitle.classList.add('hidden');
  heroRating.classList.add('hidden');
  heroDescription.classList.add('hidden');

  setTimeout(() => {
      heroImage.style.backgroundImage = `url(${currentMovie.url})`;
      heroTitle.textContent = currentMovie.nome.toUpperCase();
      heroRating.innerHTML = `${currentMovie.rating} &#9733;`;
      heroDescription.textContent = currentMovie.sinossi;

      heroImage.classList.remove('hidden');
      heroTitle.classList.remove('hidden');
      heroRating.classList.remove('hidden');
      heroDescription.classList.remove('hidden');
      aggiornaPalliniHero(); 
  }, 400); 
}

function vaiASlide(n) {
  currentIndex = (n + movies.length) % movies.length;
  mostraSlideHero(currentIndex);
}

function prossimaSlideHero() {
  vaiASlide(currentIndex + 1);
}

function precedenteSlideHero() {
  vaiASlide(currentIndex - 1);
}

// =====================
// AUTOPLAY DELLO SLIDER HERO
// =====================

function avviaAutoplayHero() {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => {
      prossimaSlideHero();
  }, HERO_INTERVAL);
}

function resettaAutoplayHero() {
  avviaAutoplayHero();
}

function fermaAutoplayHero() {
  clearInterval(sliderInterval);
}

// =====================
// GESTIONE PALLINI HERO (dots)
// =====================

function aggiornaPalliniHero() {
  if (!dotsContainer) return;
  dotsContainer.innerHTML = '';

  for (let i = 0; i < movies.length; i++) {
      const dot = document.createElement('div');
      dot.className = 'hero-dot' + (i === currentIndex ? ' active' : '');
      dot.addEventListener('click', () => {
          vaiASlide(i);
          resettaAutoplayHero();
      });
      dotsContainer.appendChild(dot);
  }
}

// =====================
// EVENTI DELLE FRECCE HERO (NAVIGAZIONE MANUALE)
// =====================

heroArrowLeft.addEventListener('click', () => {
  precedenteSlideHero();
  resettaAutoplayHero();
});

heroArrowRight.addEventListener('click', () => {
  prossimaSlideHero();
  resettaAutoplayHero();
});

// =====================
// BOTTONE "PLAY" TRAILER HERO
// =====================

heroButton.addEventListener('click', () => toggleTrailer(movies));

// toggleTrailer mostra/nasconde il trailer del film corrente
function toggleTrailer(sourceMovies) {
  if (window.closeCardTrailerPopup && typeof window.closeCardTrailerPopup === "function") {
    window.closeCardTrailerPopup();
  }
  const heroImage = document.querySelector('.hero-image');
  const heroVideo = document.querySelector('.hero-video');
  const heroButton = document.querySelector('.cta-button');
  if (!window.isTrailerPlaying) {
      const currentMovie = sourceMovies[currentIndex];
      const movieTitle = currentMovie.nome;
      const query = `${movieTitle} trailer italiano ufficiale`;
      // fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=AIzaSyDnjdrfiYW9nbMiHmT66YSkpt9cllBoBp4`)
      // SOSTITUITO con:
      fetch(`${URL_TRAILER}&part=snippet&q=${encodeURIComponent(query)}`)
          .then((response) => response.json())
          .then((data) => {
              const videoId = data.items[0]?.id?.videoId;
              if (videoId) {
                  heroVideo.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&start=10`;
                  heroVideo.style.display = 'block';
                  heroImage.style.display = 'none';
                  heroButton.textContent = '\u23F8'; // Simbolo "pausa"
                  fermaAutoplayHero();
                  window.isTrailerPlaying = true;
              }
          });
  } else {
      window.closeHeroTrailer();
      avviaAutoplayHero();
  }
}

// =====================
// AVVIO INIZIALE DELLO SLIDER HERO
// =====================

vaiASlide(0);
avviaAutoplayHero();
aggiornaPalliniHero();