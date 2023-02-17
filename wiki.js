const form = document.getElementById('search-form');
const resultsContainer = document.getElementById('search-results');

/*
    search.js

    MediaWiki API Demos
    Demo of `Search` module: Search for a text or title

    MIT License
*/
var apiUrl = "https://en.wikipedia.org/w/api.php";

const getPageId = async(search) => {
    const params = {
        action: "query",
        list: "search",
        srsearch: search,
        format: "json"
    };

    apiUrl = apiUrl + "?origin=*";
    Object.keys(params).forEach(function(key) { apiUrl += "&" + key + "=" + params[key]; });
    console.log(apiUrl);
    try {
        const response = await fetch(apiUrl)
            .then((value) => {
                return value.json();
            })
            .catch((error) => {
                alert("fetched error: " + JSON.stringify(error));
            });
        const pageid = response.query.search[0].pageid;
        console.log('pageid ', pageid);
        return pageid;
    } catch (error) {
        console.error(error);
    }
};

const getPageUrl = async(serch) => {
    const pageid = await getPageId(serch);

    const params = {
        action: 'query',
        prop: 'info',
        pageids: pageid,
        inprop: 'url',
        format: 'json'
    };
    apiUrl = apiUrl + "?origin=*";
    Object.keys(params).forEach(function(key) { apiUrl += "&" + key + "=" + params[key]; });
    console.log(apiUrl);

    try {
        const response = await fetch(apiUrl)
            .then((value) => {
                return value.json();
            })
            .catch((error) => {
                alert("fetched error: " + JSON.stringify(error));
            });
        console.log(response);
        const page = response.query.pages[pageid];
        const url = page.fullurl;
        console.log('URL for page', pageid, ':', url);
        return url;
    } catch (error) {
        console.error(error);
    }
};


form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent form from submitting normally

    const formData = new FormData(form);

    getPageUrl(formData.get('q')).then(result => {
            console.log(result);
        })
        .catch(error => {
            console.error(error);
        });
});