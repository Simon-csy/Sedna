const form = document.getElementById('search-form');
const searchContainer = document.getElementById('search-lang-results');
const othersContainer = document.getElementById('search-lang-results');

/*
    search.js

    MediaWiki API Demos
    Demo of `Search` module: Search for a text or title

    MIT License
*/
const apiUrl = "https://ja.wikipedia.org/w/api.php";
const apiUrl_zh = "https://zh.wikipedia.org/w/api.php";
const apiUrl_en = "https://en.wikipedia.org/w/api.php";

const getFromTitle = async(title, lang) => {
    const params = {
        action: "query",
        list: "search",
        srsearch: title,
        format: "json"
    };
    var url = apiUrl + "?origin=*";
    if (lang === "zh") {
        url = apiUrl_zh + "?origin=*";
    } else if (lang === "en") {
        url = apiUrl_en + "?origin=*";
    }

    Object.keys(params).forEach(function(key) { url += "&" + key + "=" + params[key]; });
    console.log(url);
    try {
        const response = await fetch(url)
            .then((value) => {
                return value.json();
            })
            .catch((error) => {
                alert("fetched error: " + JSON.stringify(error));
            });
        return response.query.search[0];
    } catch (error) {
        console.error(error);
    }
};

const getFirstLng = async(search) => {
    const params = {
        action: "query",
        list: "search",
        srsearch: search,
        format: "json"
    };

    let url = apiUrl + "?origin=*";
    Object.keys(params).forEach(function(key) { url += "&" + key + "=" + params[key]; });
    console.log(url);
    try {
        const response = await fetch(url)
            .then((value) => {
                return value.json();
            })
            .catch((error) => {
                alert("fetched error: " + JSON.stringify(error));
            });
        return response.query.search[0];
    } catch (error) {
        console.error(error);
    }
};

const getOtherLng = async(serch) => {

    const params = {
        action: 'query',
        prop: 'langlinks',
        titles: serch.title,
        lllimit: 500,
        // lllang: lang,
        format: 'json'
    };
    let url = apiUrl + "?origin=*";
    Object.keys(params).forEach(function(key) { url += "&" + key + "=" + params[key]; });
    console.log(url);

    try {
        const response = await fetch(url)
            .then((value) => {
                return value.json();
            })
            .catch((error) => {
                alert("fetched error: " + JSON.stringify(error));
            });
        return response.query.pages[serch.pageid];
    } catch (error) {
        console.error(error);
    }
};

var card_template = `
<div class="card m-3" style="width: 18rem;">
<div class="card-body">
  <h5 class="card-title">dynamictitle</h5>
  <p class="card-text">dynamictext</p>
  <a href="dynamiclink" class="card-link">link</a>
</div>
</div>
`;


form.addEventListener('submit', (event) => {
    event.preventDefault(); // prevent form from submitting normally

    const formData = new FormData(form);

    getFirstLng(formData.get('q')).then(result => {
            console.log(result);

            card_first = card_template.replace('dynamictext', result.snippet);
            card_first = card_first.replace('dynamictitle', result.title);
            card_first = card_first.replace('dynamiclink', 'http://jp.wikipedia.org/?curid=' + result.pageid);

            searchContainer.innerHTML = card_first;
            getOtherLng(result).then(result => {
                console.log(result);
                result.langlinks.forEach(element => {
                    if (element.lang == 'zh') {
                        console.log(element["*"]);
                        getFromTitle(element["*"], 'zh').then(result => {
                            console.log(result);
                            card_other = card_template.replace('dynamictext', result.snippet);
                            card_other = card_other.replace('dynamictitle', result.title);
                            card_other = card_other.replace('dynamiclink', 'http://zh.wikipedia.org/?curid=' + result.pageid);
                            othersContainer.insertAdjacentHTML('beforeend', card_other);
                        });
                    }
                    if (element.lang == 'en') {
                        getFromTitle(element["*"], 'en').then(result => {
                            console.log(result);
                            card_other = card_template.replace('dynamictext', result.snippet);
                            card_other = card_other.replace('dynamictitle', result.title);
                            card_other = card_other.replace('dynamiclink', 'http://en.wikipedia.org/?curid=' + result.pageid);
                            othersContainer.insertAdjacentHTML('beforeend', card_other);
                        });
                    }
                });
            })
        })
        .catch(error => {
            console.error(error);
        });
});