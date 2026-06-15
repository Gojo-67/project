const container = document.querySelector("#animeContainer")
const searchInput = document.querySelector("#searchInput")
const modal = document.querySelector("#modal")
const closeModal = document.querySelector("#closeModal")
let timeout = null
let showFavorites = false
let curentAnimeList = []
const favoritesBtn = document.querySelector("#favoritesBtn")
const sortSelect = document.querySelector("#sortSelect")
let favorites = JSON.parse(localStorage.getItem("favorites")) || []

async function fetchAnime(search = "") {
  let url = "https://api.jikan.moe/v4/anime?limit=12";

  if (search) {
    url = `https://api.jikan.moe/v4/anime?q=${search}&limit=12`;
  }

  const response = await fetch(url);
  const data = await response.json();

  curentAnimeList = data.data;

  displayAnime(curentAnimeList);
}

function displayAnime(animeList) {
  container.innerHTML = ""

  animeList.forEach(anime => {
    const isFavorite = favorites.includes(anime.mal_id)
    const card = document.createElement("div")
    card.classList.add('card')
    card.innerHTML = `
      <div class="favorite">
        ${isFavorite ? "⭐" : "☆"}
      </div>

      <img src="${anime.images.jpg.image_url}" alt="${anime.title}">

      <div class="card-content">
        <h2>${anime.title}</h2>
        <p class="rating">⭐ ${anime.score || "N/A"}</p>
      </div>
    `
    card.addEventListener('click', () => openModal(anime))
    const favoritesBtn = card.querySelector(".favorite")
    favoritesBtn.addEventListener("click", (event) => {
      event.stopPropagation()
      toggleFavorite(anime.mal_id)
    })
    container.appendChild(card)
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favID) => favID != id)
  }
  else favorites.push(id)
  localStorage.setItem("favorites", JSON.stringify(favorites))
  displayAnime(curentAnimeList)
}

favoritesBtn.addEventListener("click", () => {
  showFavorites = !showFavorites;

  if (showFavorites) {
    const favoriteAnime = curentAnimeList.filter(anime =>
      favorites.includes(anime.mal_id)
    );

    displayAnime(favoriteAnime);

    favoritesBtn.textContent = "Show All";
  } else {
    displayAnime(curentAnimeList);

    favoritesBtn.textContent = "Show Favorites";
  }
});

sortSelect.addEventListener('change',(event)=>{
  const sorted = curentAnimeList.slice()
  if(event.target.value=='rating-desc'){
    sorted.sort((a,b)=>b.score-a.score)
  }
   if(event.target.value=='rating-asc'){
    sorted.sort((a,b)=>a.score-b.score)
  }
  displayAnime(sorted)
})
searchInput.addEventListener("input", (event) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    fetchAnime(event.target.value.trim())
  }, 500)

})

/* =========================
   MODAL
========================= */
function openModal(anime) {
  document.getElementById('modalImg').src =
    anime.images.jpg.large_image_url;

  document.getElementById('modalTitle').textContent =
    anime.title;

  document.getElementById('modalRating').textContent =
    `⭐ Rating: ${anime.score || 'N/A'}`;

  document.getElementById('modalGenres').textContent =
    `Genres: ${anime.genres.map(g => g.name).join(', ')}`;

  document.getElementById('modalSynopsis').textContent =
    anime.synopsis || 'No description';

  modal.classList.remove('hidden');
}

function close() {
  modal.classList.add('hidden');
}

closeModal.addEventListener('click', close);

modal.addEventListener('click', (e) => {
  if (e.target === modal) close();
});
fetchAnime()