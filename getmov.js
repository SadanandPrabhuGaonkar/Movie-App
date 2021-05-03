const API_KEY = 'api_key=5035481b6211d2a37439cf4153ddd0db';
const BASE_URL = 'https://api.themoviedb.org/3';
const API_URL = BASE_URL + '/discover/movie?sort_by=populartiy.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const main = document.getElementById('main');
const vids = document.getElementById("vid");

function getMovies(url) {

    fetch(url).then(res => res.json()).then(data => {
        if (data.results.length !== 0) {
            showMovies(data.results);
        } else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
        }

    })

}

function showMovies(data) {
    main.innerHTML = '';
    data.forEach(movie => {
        const { id, title, poster_path, vote_average, overview } = movie;
        if (id == sessionStorage.getItem("id")) {//checks id id is similar to id of clicked movie
            const movieEl = document.createElement('div');
            movieEl.classList.add('movie');
            movieEl.innerHTML = `
        <div class="movie-info">
                <h3>${title}</h3>
            </div>
             <img src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">
            
            <div class="overview">
                <button class="button" id="play" onclick="setlink()">Watch Trailer</button>
                <h3>Overview</h3>
                <h5>${overview}<h5>
                <h3>Ratings</h3>
                <h4>${vote_average}</h4>
            </div>
        
        `
            main.appendChild(movieEl);
        }
    })
}

//Gets the Video key for the trailer and sends it to play function in script tag
function setlink() {
    fetch("https://api.themoviedb.org/3/movie/" + sessionStorage.getItem("id") + "/videos?api_key=1cf50e6248dc270629e802686245c2c8").then(res => res.json()).then(data => {
        if (data.results.length !== 0) {
            data.results.forEach(movie => {
                const { key, type } = movie;
                if (type == "Trailer") {
                    play(key);
                }
            })

        } else {
            vids.innerHTML = `<h1 class="no-results">No Trailer Found</h1>`
        }

    })
}

function getColor(vote) {
    if (vote >= 8) {
        return 'green'
    } else if (vote >= 5) {
        return "orange"
    } else {
        return 'red'
    }
}

const searchTerm = sessionStorage.getItem("movie")
// if serachterm variable has a value then queries api for said title
if (searchTerm) {
    getMovies(searchURL + '&query=' + searchTerm)
} else {
    getMovies(API_URL);
}