const API_KEY = 'api_key=1cf50e6248dc270629e802686245c2c8';
const BASE_URL = 'https://api.themoviedb.org/3';
const sortrating = "vote_average.desc&vote_count.gte=10";
let cursort = sortrating; // Default for current sort is set as Rating
const sortAlpha = "original_title.desc";
const sortrelease = "release_date.desc";
const sortpopular = "popularity.desc";
const API_URL = BASE_URL + '/discover/movie?sort_by=' + cursort + '&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

//set current sort and return correct url
function recalc(a) {
    if (a == 1) {
        cursort = sortrating;
    } else {
        if (a == 2) {
            cursort = sortrelease;
        } else {
            if (a == 3) {
                cursort = sortAlpha;
            } else {
                cursort = sortpopular;
            }
        }
    };
    return (BASE_URL + '/discover/movie?sort_by=' + cursort + '&' + API_KEY);
}


//clear main and call api 
function clearBtn(a) {
    main.innerHTML = ""
    getMovies(recalc(a));
}

//simple function to call different pages
function getMoviessc(x) {
    getMovies(BASE_URL + '/discover/movie?sort_by=' + cursort + '&' + API_KEY, x);
}

getMovies(API_URL);

//fetches and converts reults to json and sends to show movies
function getMovies(url, i) {
    if (i > 0) {
        url = url + "&page=" + String(i)
        sessionStorage.setItem("load", "1")
    }
    fetch(url).then(res => res.json()).then(data => {
        if (data.results.length !== 0) {
            showMovies(data.results);
            sessionStorage.removeItem("load");
        } else {
            main.innerHTML = `<h1 class="no-results">No Results Found</h1>`
            sessionStorage.setItem("load", "1");
        }

    })
}



//create and set inner html
function showMovies(data) {

    data.forEach(movie => {
        const { id, original_title, title, poster_path, vote_average, overview } = movie;
        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `
            <img onclick="savename('${original_title}','${id}')" src="${poster_path ? IMG_URL + poster_path : "http://via.placeholder.com/1080x1580"}" alt="${title}">
            <div class="movie-info">
                <h3>${title}</h3>
                <span class="${getColor(vote_average)}">${vote_average}</span>
            </div>
            <div class="overview">
                <h3>Overview</h3>
                ${overview}
            </div>
        `
        main.appendChild(movieEl);
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

// Saves title and id into session storage and redirects to movie details page
function savename(data, id) {
    sessionStorage.setItem("movie", data);
    sessionStorage.setItem("id", id);
    window.location.href = "./page.html";
}

// Event listener for search
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const searchTerm = search.value;
    if (searchTerm) {
        main.innerHTML = ""
        getMovies(searchURL + '&query=' + searchTerm, 0)
    } else {
        getMovies(API_URL, 1);
    }

})

var menu = document.querySelector(".menu")
var ham = document.querySelector(".ham")
var xIcon = document.querySelector(".xIcon")
var menuIcon = document.querySelector(".menuIcon")

ham.addEventListener("click", toggleMenu)

function toggleMenu() {
    if (menu.classList.contains("showMenu")) {
        menu.classList.remove("showMenu");
        xIcon.style.display = "none";
        menuIcon.style.display = "block";
    } else {
        menu.classList.add("showMenu");
        xIcon.style.display = "block";
        menuIcon.style.display = "none";
    }
}

var menuLinks = document.querySelectorAll(".menuLink")

menuLinks.forEach(
    function(menuLink) {
        menuLink.addEventListener("click", toggleMenu)
    }
)

// when searched! scroll to main div to show results:
function scrollfunc() {
    var elmnt = document.getElementById("main");
    elmnt.scrollIntoView();
}