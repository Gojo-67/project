const container =document.querySelector("#animeContainer")
const searchInput = document.querySelector("#searchInput")

async function fetchAnime(query="naruto"){
    const response = await fetch(`https://api.jikan.moe/v4/anime?q=${query}&limit=12`)
    const data = await response.json()
    displayAnime(data.data)
}

function displayAnime(animeList){
    container.innerHTML = ""

    animeList.forEach(anime => {
        container.innerHTML+=`
            <div class="card">
                <img src ="${anime.images.jpg.image_url}">
                <div class="card-content">
                    <h2>${anime.title}</h2>
                    <p class="rating">${anime.score}</p>
                    <p class="discription">${anime.synopsis}</p>
                </div>
            </div>
        `
        
    });
}

searchInput.addEventListener("input",(event)=>{
    fetchAnime(event.target.value)
})
fetchAnime()