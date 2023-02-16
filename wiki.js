const form = document.getElementById('search-form');
const resultsContainer = document.getElementById('search-results');

/*
    search.js

    MediaWiki API Demos
    Demo of `Search` module: Search for a text or title

    MIT License
*/

var url = "https://en.wikipedia.org/w/api.php";

var params = {
    action: "query",
    list: "search",
    srsearch: "Nelson Mandela",
    format: "json"
};


// Object.keys(params).forEach(function(key) { url += "&" + key + "=" + params[key]; });


form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent form from submitting normally
    console.log('addEventListener');
    const formData = new FormData(form);
    params['srsearch'] = formData.get('q');
    url = url + "?origin=*";
    Object.keys(params).forEach(function(key) { url += "&" + key + "=" + params[key]; });

    console.log(url);
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(response) {
            console.log(response)
            resultsContainer.innerHTML = JSON.stringify(response.query.search[0], null, 2);
        })
        .catch(function(error) { console.log(error); });
});