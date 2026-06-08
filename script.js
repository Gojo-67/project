const container =document.querySelector("#animeContainer")
const searchInput = document.querySelector("#searchInput")
const modal=document.querySelector("#modal")
const closeModal=document.querySelector("#closeModal")
let timeout=null
async function fetchAnime(){
    const response = await fetch(`https://api.jikan.moe/v4/anime?limit=12`)
    const data = await response.json()
    displayAnime(data.data)
}

function displayAnime(animeList){
    container.innerHTML = ""

    animeList.forEach(anime => {
        const card=document.createElement("div")
        card.classList.add('card')
        card.innerHTML=`
          
                <img src ="${anime.images.jpg.image_url}">
                <div class="card-content">
                    <h2>${anime.title}</h2>
                    <p class="rating">${anime.score}</p>
                    
                </div>
           
        `
    card.addEventListener('click',()=>openModal(anime))    
    container.appendChild(card)
    });
}

searchInput.addEventListener("input",(event)=>{
    clearTimeout(timeout)
    timeout=setTimeout(()=>{
fetchAnime(event.target.value.trim())
    },500)
    
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