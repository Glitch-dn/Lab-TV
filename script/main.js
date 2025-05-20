/*****************************************************************
                 main.js - LOGICA GENERALE APP                
 Questo file gestisce la logica principale della pagina:      
 - Caricamento e ricerca film                                 
 - Creazione dinamica delle card                              
 - Gestione slider per navigare tra i film                    
 - Gestione popup trailer delle card                          
 - Prevenzione sovrapposizione trailer card/hero              
 ****************************************************************/

// ==========================
// DEFINIZIONE URL PER LE API
// ==========================
const url = URL_MOVIES;
const urlSearch = URL_SEARCH;
const urlTrailer = URL_TRAILER;

// ==========================
// FUNZIONI GLOBALI DI CHIUSURA TRAILER (ANTI-SOVRAPPOSIZIONE)
// ==========================

window.closeCardTrailerPopup = function() {
  const popup = document.getElementById("trailer-popup");
  const iframe = document.getElementById("trailer-iframe");
  if (popup && iframe) {
    popup.classList.remove("visible");
    iframe.src = "";
  }
  // Riavvia lo slider hero SOLO se il trailer hero NON è attivo
  if (window.isHeroSliderAvailable && typeof window.isHeroSliderAvailable === "function") {
    if (!window.isHeroSliderAvailable()) {
      if (window.startHeroBanner && typeof window.startHeroBanner === "function") {
        window.startHeroBanner(window.heroMoviesArray);
      }
    }
  }
};
// Funzione placeholder, ridefinita in hero.js per chiudere il trailer hero
window.closeHeroTrailer = function() {};

// ==========================
// CARICAMENTO INIZIALE FILM (on page load)
// ==========================

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    popolaRow(data.data);
  })
  .catch((error) => console.error("Errore nel caricamento iniziale:", error));

// ==========================
// OTTIENI ID TRAILER YOUTUBE PER UN FILM
// ==========================

async function prendiTrailer(title) {
  const query = `${title} trailer italiano ufficiale`;
  const apiUrl = `${URL_TRAILER}&part=snippet&q=${encodeURIComponent(query)}&type=video`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const videoId = data.items[0]?.id?.videoId;
    const description = data.items[0]?.snippet?.description;
    if (videoId) {
      return { videoId, description };
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// ==========================
// CREAZIONE CARD FILM DINAMICAMENTE
// ==========================

function creaCard(movie) {
  const card = document.createElement("div");
  card.classList.add("movie-card");
  card.innerHTML = `
    <div class="poster-container">
      <img src="${movie.poster_path}" alt="${movie.original_title || "Titolo non disponibile"}" class="movie-image">
    </div>
    <div class="movie-details">
      <h3 class="movie-title">${movie.original_title || "Titolo non disponibile"}</h3>
      <p class="movie-rating">⭐ ${movie.vote_average || (Math.random() * (10 - 6) + 6).toFixed(1)}</p>
    </div>
  `;
  let hoverTimer;

  // Avvia il trailer della card (chiude anche il trailer hero)
  async function avviaTrailerCard() {
    if (window.closeHeroTrailer && typeof window.closeHeroTrailer === "function") {
      window.closeHeroTrailer();
    }
    window.closeCardTrailerPopup();
    const title = movie.original_title || "trailer";
    const trailerData = await prendiTrailer(title);
    if (trailerData) {
      const { videoId, description } = trailerData;
      const popup = document.getElementById("trailer-popup");
      const iframe = document.getElementById("trailer-iframe");
      const titleElement = document.querySelector(".trailer-title");
      const descriptionElement = document.getElementById("trailer-description");
      if (!popup || !iframe || !descriptionElement) return;
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&start=8`;
      titleElement.textContent = title;
      descriptionElement.textContent = description || "Descrizione non disponibile.";
      popup.classList.add("visible");
    }
  }

  // Listener dinamici responsive: hover su desktop, click su mobile/tablet
  function setCardTrailerListeners() {
    card.onmouseover = null;
    card.onmouseout = null;
    card.onclick = null;
    if (window.innerWidth >= 1024) {
      card.onmouseover = () => {
        hoverTimer = setTimeout(avviaTrailerCard, 3000);
      };
      card.onmouseout = () => {
        clearTimeout(hoverTimer);
      };
    } else {
      card.onclick = avviaTrailerCard;
    }
  }
  setCardTrailerListeners();
  window.addEventListener('resize', setCardTrailerListeners);

  return card;
}

// ==========================
// EVENTO CHIUSURA POPUP TRAILER CARD
// ==========================

document.getElementById("close-popup").addEventListener("click", () => {
  window.closeCardTrailerPopup();
});

// ==========================
// FUNZIONE SLIDER PER RIGHE FILM
// ==========================

function gestisciSlider(row, movies, direction) {
  const visibleCards = row.querySelectorAll(".movie-card");
  const currentIndex = row.dataset.currentIndex ? parseInt(row.dataset.currentIndex) : 0;
  if (direction === "right" && currentIndex + 5 < movies.length) {
    row.dataset.currentIndex = currentIndex + 1;
    visibleCards[0].remove();
    row.appendChild(creaCard(movies[currentIndex + 5]));
  } else if (direction === "left" && currentIndex > 0) {
    row.dataset.currentIndex = currentIndex - 1;
    visibleCards[visibleCards.length - 1].remove();
    row.prepend(creaCard(movies[currentIndex - 1]));
  }
}

// ==========================
// POPOLA LE RIGHE CON I FILM
// ==========================

async function popolaRow(data) {
  async function fetchMovieDetails(title) {
    const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
    try {
      const response = await fetch(url);
      const movieDetails = await response.json();
      return movieDetails.Response === "True" ? movieDetails : null;
    } catch (error) {
      return null;
    }
  }
  // Prime due righe: film finti
  const movies1 = data.slice(0, 10);
  const movies2 = data.slice(10, 20);
  const rowOne = document.querySelector(".row.one");
  const rowTwo = document.querySelector(".row.two");
  rowOne.innerHTML = "";
  rowTwo.innerHTML = "";
  movies1.slice(0, 5).forEach((movie) => rowOne.appendChild(creaCard(movie)));
  rowOne.dataset.movies = JSON.stringify(movies1);
  rowOne.dataset.currentIndex = 0;
  movies2.slice(0, 5).forEach((movie) => rowTwo.appendChild(creaCard(movie)));
  rowTwo.dataset.movies = JSON.stringify(movies2);
  rowTwo.dataset.currentIndex = 0;
  // Altre righe: action, anni 90-2024
  const rowThree = document.querySelector(".row.three");
  const rowFour = document.querySelector(".row.four");
  const actionMovies = [];
  const yearMovies = [];
  rowThree.innerHTML = "";
  rowFour.innerHTML = "";
  for (const movie of data) {
    const details = await fetchMovieDetails(movie.original_title);
    if (details) {
      const card = creaCard({
        poster_path: details.Poster !== "N/A" ? details.Poster : "../LabTV-Loghi/default-poster.jpg",
        original_title: details.Title,
        vote_average: details.imdbRating || (Math.random() * (10 - 6) + 6).toFixed(1),
      });
      if (details.Genre && details.Genre.includes("Action")) {
        actionMovies.push(card);
      } else if (parseInt(details.Year) >= 1990 && parseInt(details.Year) < 2024) {
        yearMovies.push(card);
      }
    }
  }
  actionMovies.slice(0, 5).forEach((movie) => rowThree.appendChild(movie));
  rowThree.dataset.movies = JSON.stringify(actionMovies.map((movie) => ({
    poster_path: movie.querySelector(".movie-image").src,
    original_title: movie.querySelector(".movie-title").textContent,
    vote_average: movie.querySelector(".movie-rating").textContent.replace("⭐ ", "")
  })));
  rowThree.dataset.currentIndex = 0;
  yearMovies.slice(0, 5).forEach((movie) => rowFour.appendChild(movie));
  rowFour.dataset.movies = JSON.stringify(yearMovies.map((movie) => ({
    poster_path: movie.querySelector(".movie-image").src,
    original_title: movie.querySelector(".movie-title").textContent,
    vote_average: movie.querySelector(".movie-rating").textContent.replace("⭐ ", "")
  })));
  rowFour.dataset.currentIndex = 0;
}

// ==========================
// RICERCA FILM (OMDB API)
// ==========================

function gestisciRicerca(search) {
  const fetchPage = (page) =>
    fetch(`${urlSearch}${search}&page=${page}`)
      .then((response) => response.json())
      .then((data) => data.Search || []);
  Promise.all([fetchPage(1), fetchPage(2), fetchPage(3), fetchPage(4)])
    .then((results) => {
      const allMovies = results.flat();
      const filteredMovies = allMovies.filter((movie) => movie.Poster && movie.Poster !== "N/A");
      return filteredMovies;
    })
    .then((filteredMovies) => {
      const movies = filteredMovies.map((movie) => ({
        poster_path: movie.Poster || "LabTV-Loghi/default_poster.jpg",
        original_title: movie.Title,
        vote_average: movie.imdbRating,
      }));
      popolaRow(movies);
    })
    .catch((error) => console.error("Errore nella ricerca:", error));
}

// ==========================
// EVENTO BARRA DI RICERCA
// ==========================

document.querySelector("#input-bar1").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const search = e.target.value;
    gestisciRicerca(encodeURIComponent(search));
  }
});

// ==========================
// EVENTI SLIDER (FRECCE NAVIGAZIONE)
// ==========================

document.querySelectorAll(".arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const row = arrow.closest(".section").querySelector(".row");
    const movies = JSON.parse(row.dataset.movies);
    const direction = arrow.classList.contains("right") ? "right" : "left";
    gestisciSlider(row, movies, direction);
  });
});