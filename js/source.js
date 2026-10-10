// *********************************************************************
// Homework 4 Public APIs
// *********************************************************************

function formatYearFromStr(dateString) {
  return dateString.split('-')[0];
}

function formatPercentage(value) {
  return `${(value * 100).toFixed(2)}%`;
}

localStorage.setItem("game_id", "532608");
localStorage.setItem("api_key", "fb038c7c2bd94fe78b869295a62e91e5");



async function load(){
    
    // add as many more as needed
    let gameID = localStorage.getItem("game_id");
    let apiKey = localStorage.getItem("api_key");
    
    // **************** Write you code below **************** 

    const BASE_URL = 'https://api.gamebrain.co/v1';

    try {

        const detailsResponse = await fetch(`${BASE_URL}/games/${gameID}?api-key=${apiKey}`);
        const gameData = await detailsResponse.json();

        document.querySelector('#game-name').textContent = gameData.name; 
        document.querySelector('.game-genre').textContent = gameData.genre; 
        document.querySelector('.game-image img').src = gameData.artwork_url || gameData.background_image || ''; 

        const releaseYear = formatYearFromStr(gameData.release_date);
        document.querySelector('.game-meta').textContent = `${gameData.developer} • ${releaseYear}`; 

        const newsResponse = await fetch(`${BASE_URL}/games/${gameID}/news?api-key=${apiKey}`);
        const newsData = await newsResponse.json();
        
        const newsCards = document.querySelectorAll('.news-card'); 

        for (let i = 0; i < Math.min(3, newsCards.length); i++) {
            if (newsData && newsData[i]) {
                newsCards[i].querySelector('h3').textContent = newsData[i].title; 
                newsCards[i].querySelector('.news-published').textContent = `Published ${newsData[i].published}`; 
                newsCards[i].querySelector('img').src = newsData[i].artwork_url || newsData[i].image_url || ''; 
            }
        }

        const similarGames = gameData.similar_games || []; 
        const gameCards = document.querySelectorAll('.game-card'); 

        for (let i = 0; i < Math.min(4, gameCards.length); i++) {
            if (similarGames[i]) {
                gameCards[i].querySelector('h3').textContent = similarGames[i].name; 
                
                const metaSpans = gameCards[i].querySelectorAll('.game-card-meta span');
                if (metaSpans.length >= 2) {
                    metaSpans[0].textContent = Math.floor(similarGames[i].year);
                    metaSpans[1].textContent = formatPercentage(similarGames[i].rating);
                }
                
                if (similarGames[i].screenshots && similarGames[i].screenshots.length > 0) {
                    gameCards[i].querySelector('img').src = similarGames[i].screenshots[0]; 
                }
            }
        }

    } catch (error) {
        console.error("Error executing API retrieval or DOM render:", error);
    }
}
load();
