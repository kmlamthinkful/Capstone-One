//API ENDPOINTS
const GEOCODE_SEARCH_URL = 'https://maps.googleapis.com/maps/api/geocode/json';
const FOURSQUARE_URL = 'https://api.foursquare.com/v2/venues/'
const FOURSQUARE_TIPS_URL = 'https://api.foursquare.com/v2/venues/' // modify to construct endpoint address for search, tips and photos

//Global Variables Here
let searchLocationGeo = "";
let locationGeo="";
let locationGeoLat ="";
let locationGeoLng = "";


//need to catch if it isn't a valid address or city name
function retrieveGoogleGeocodingData(searchLocationGeo, callGeoData){
    const addressSearch = {
        key: 'AIzaSyAMU9Dj6A_KxoL3zmCRfS5U8bi8WV-01Fc',
        address: `${searchLocationGeo}` 
    };
    $.getJSON(GEOCODE_SEARCH_URL, addressSearch , callGeoData);
    
}

function callGeoData(data){
    console.log(data);
   locationGeo = data.results[0].geometry.location
     locationGeoLat = data.results[0].geometry.location.lat;
     locationGeoLng = data.results[0].geometry.location.lng;
     $('#js-search-results').empty();
}

//EVENT LISTEN - Coffee, Sushi and Sandwiches
function handleCoffeeClick(){
    $('#buttonCoffee').click(event =>{
        event.preventDefault();
      const fourSquareCoffeeQuery = {
    ll: `${locationGeoLat}, ${locationGeoLng}`,
    client_id: 'AGSZCIMTJHOEQYLH3JA0MBUT0NDJOD2ACHB5CIFNAQMOIGOI',
    client_secret: 'EJG3ULU1EMP20VWXGKUDJCFZCUBUAGMF35ZESRNASEC3RZGA',
    limit: 1, //temporary limit to reduce quota depletion
    radius: 3218.69,
    query: 'coffee',
    v: '20180425',
}
$.getJSON(`${FOURSQUARE_URL}search`,fourSquareCoffeeQuery, renderFourSquareSearchData)
});
}

function handleSandwichClick(){
    $('#buttonSandwich').click(event =>{
        event.preventDefault();
       const fourSquareSandwichQuery = {
    ll: `${locationGeoLat}, ${locationGeoLng}`,
    client_id: 'AGSZCIMTJHOEQYLH3JA0MBUT0NDJOD2ACHB5CIFNAQMOIGOI',
    client_secret: 'EJG3ULU1EMP20VWXGKUDJCFZCUBUAGMF35ZESRNASEC3RZGA',
    limit: 1, //temporary limit to reduce quota depletion
    radius: 3218.69,
    query: 'sandwich',
    v: '20180425',
}
$.getJSON(`${FOURSQUARE_URL}/search`,fourSquareSandwichQuery, renderFourSquareSearchData)
});
}

function handleSushiClick(){
    $('#buttonSushi').click(event =>{
        event.preventDefault();
       const fourSquareSushiQuery = {
    ll: `${locationGeoLat}, ${locationGeoLng}`,
    client_id: 'AGSZCIMTJHOEQYLH3JA0MBUT0NDJOD2ACHB5CIFNAQMOIGOI',
    client_secret: 'EJG3ULU1EMP20VWXGKUDJCFZCUBUAGMF35ZESRNASEC3RZGA',
    limit: 2, //temporary limit to reduce quota depletion
    radius: 3218.69,
    query: 'sushi',
    v: '20180425',
}
$.getJSON(`${FOURSQUARE_URL}/search`,fourSquareSushiQuery, renderFourSquareSearchData)
});
}


function generateFourSquareSearchResults(venueResults){
    venueUniqueId = venueResults.id;
    retrieveFourSquareTipsData(venueUniqueId);
    retrieveFourSquarePhotos(venueUniqueId);
    return `
        <div>
        <h2> ${venueResults.name}</h2>
            <div> Distance: ${venueResults.location.distance} meters away</div>   
            <div> ${venueResults.location.formattedAddress} </div>
            <div id = ${venueResults.id}></div>`;

}

function renderFourSquareSearchData(data){
    fourSquareSearchResults = data.response.venues.map((venuesResults) => generateFourSquareSearchResults(venuesResults)); 
    $('#js-search-results').html(fourSquareSearchResults);
}

//TIPS AJAX Request
function retrieveFourSquareTipsData(venueUniqueId){
    const fourSquareTipsSearch = {
        client_id: 'AGSZCIMTJHOEQYLH3JA0MBUT0NDJOD2ACHB5CIFNAQMOIGOI',
        client_secret: 'EJG3ULU1EMP20VWXGKUDJCFZCUBUAGMF35ZESRNASEC3RZGA',
        sort: 'popular',
        limit: '1',
        v: '20180425',
    }
    const tipsSettings = {
        url:`${FOURSQUARE_URL}${venueUniqueId}/tips`,
        data: fourSquareTipsSearch,
        dataType: 'json',
        type: 'GET',
        success: function(data){
                renderFourSquareTipsData(data, venueUniqueId)
            }
         }
     $.ajax(tipsSettings)
}


function renderFourSquareTipsData(data, venueId){
        console.log(data);
        fourSquareTips = data.response.tips.items.map((tipResults) => generateFourSquareTipResults(tipResults));
         console.log(`${venueId}`);
         $(`#${venueId}`).append(fourSquareTips);
     }
     

function generateFourSquareTipResults(tipResults){
        return `<div class = 'tip'> Tip: ${tipResults.text}</div> 
                <a href ='${tipResults.canonicalUrl}'>FourSquare Details</a>`
}
//PHOTO AJAX REQUEST
function retrieveFourSquarePhotos(venueUniqueId){
    const fourSquarePhotoSearch = {
        client_id: 'AGSZCIMTJHOEQYLH3JA0MBUT0NDJOD2ACHB5CIFNAQMOIGOI',
        client_secret: 'EJG3ULU1EMP20VWXGKUDJCFZCUBUAGMF35ZESRNASEC3RZGA',
        limit: 1,
        v: '20180425',
    }
    const photoSettings = {
        url: `${FOURSQUARE_URL}${venueUniqueId}/photos`,
        data: fourSquarePhotoSearch,
        dataType: 'json',
        type: 'GET',
        success: function(data){
            renderFourSquarePhotoData(data, venueUniqueId)
        }
    }
    $.ajax(photoSettings);
}

function renderFourSquarePhotoData(data, venueId){
    console.log(data)
      let  fourSquarePhotos = data.response.photos.items.map((photoResults) => generateFourSquarePhotoResults(photoResults));
      $(`#${venueId}`).append(fourSquarePhotos);
}

function generateFourSquarePhotoResults(photoResults){
        console.log(`${photoResults.prefix}`);
        return `<div class = 'photoBox'><img class = 'venuePhoto' src = '${photoResults.prefix}125x225${photoResults.suffix}' alt = '${photoResults.source.name}'></div>`
}
    
    


//going to need to map your 2nd ajax request to append properly
//.append any additional results under here using your 2nd ajax request

//callback function can use venueId to grab tips and to properly append


function listenAddressSubmit(){
    $('.js-search-form').submit(event =>{
        event.preventDefault();
        const userInput =$(event.currentTarget).find('.js-query');
        const userQueryLocation = userInput.val();
        userInput.val("");
        
    //Convert userInput into array and then into portion of web address
        let nameLocation = userQueryLocation.split(' ');
        let locationAddress = nameLocation[0];
    for (let i = 1; i < nameLocation.length; i++) {
    locationAddress = `${locationAddress}+${nameLocation[i]}`; 
}
    searchLocationGeo = locationAddress;
    $('#buttonCoffee').prop('hidden',false);
    $('#buttonSandwich').prop('hidden', false);
    $('#buttonSushi').prop('hidden',false);
    retrieveGoogleGeocodingData(searchLocationGeo, callGeoData);
});
}
   //if results are valid then show buttons 
    

// EVENT LISTENERS SECTION
function listenClick(){
    listenAddressSubmit();
    handleCoffeeClick();
    handleSandwichClick();
    handleSushiClick();
}   

$(listenClick);
