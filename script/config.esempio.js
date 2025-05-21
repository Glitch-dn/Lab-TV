/***********************************************************************
 * config.js - Configurazione chiavi API e endpoint
 * NON VERSIONARE con dati reali! Usa config.example.js per il template.
 ***********************************************************************/

// -- API KEYS --
const OMDB_API_KEY = "YOUR_OMDB_API_KEY";
const YOUTUBE_API_KEY = "YOUR_YOUTUBE_API_KEY";

// -- ENDPOINTS --
const URL_MOVIES = "YOUR_MOVIES_ENDPOINT";
const URL_SEARCH = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&s=`;
const URL_TRAILER = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}`;