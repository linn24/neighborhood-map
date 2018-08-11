var defaultIcon;
var highlightedIcon;

function googleError() {
    console.log('error occurred');
    alert('An error occurred while retrieving the information from Google Maps API.');
}

function initMap() {
    // Create a styles array to use with the map.
    var styles = [
        {
            featureType: 'water',
            stylers: [
                { color: '#19a0d8' }
            ]
        },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
                { color: '#ffffff' },
                { weight: 6 }
            ]
        },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
                { color: '#e85113' }
            ]
        },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
                { color: '#efe9e4' },
                { lightness: -40 }
            ]
        },{
            featureType: 'transit.station',
            stylers: [
                { weight: 9 },
                { hue: '#e85113' }
            ]
        },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
                { visibility: 'off' }
            ]
        },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
                { lightness: 100 }
            ]
        },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
                { lightness: -100 }
            ]
        },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
                { visibility: 'on' },
                { color: '#f0e4d3' }
            ]
        },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
                { color: '#efe9e4' },
                { lightness: -25 }
            ]
        }
    ];

    // Create center location of the map.
    var washingtonSquare = new google.maps.LatLng(40.7434128, -73.9880056);
    //(1.3380368, 103.8128534);

    // Create an InfoWindow so that map will have only 1 window at any time
    largeInfowindow = new google.maps.InfoWindow();

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: washingtonSquare,
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    // Create search request with parameters.
    request = {
        location: washingtonSquare,
        radius: '5000',
        type: ['museum'],
        rankby: 'distance'
    };

    placeService = new google.maps.places.PlacesService(map);
    placeService.nearbySearch(request, callback);

    // Style the markers a bit. This will be our listing marker icon.
    defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    highlightedIcon = makeMarkerIcon('FFFF24');
}

function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        var maxLen = results.length;
        if (maxLen > 10) {
            maxLen = 10;
        }
        for (var i = 0; i < maxLen; i++) {
            var place = results[i];

            // Create new marker for each location.
            createMarker(place);
        }
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
        map: map,
        position: placeLoc,
        title: place.name,
        animation: google.maps.Animation.DROP,
        icon: defaultIcon
    });
    // Create an onclick event to open the large infowindow at each marker.
    marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow, place.vicinity);
        getNYTimesData(this);
        this.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null); }, 1400);
    });
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
    });
    // Add marker into marker list
    myModel.markerList.push(marker);
}

function populateInfoWindow(marker, infowindow, address) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent(marker.title + "<br>" + address + "<ul id='nytimes-articles' class='article-list'></ul>");
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
}

function getNYTimesData(marker) {
    var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + marker.title + '&sort=newest&api-key=072356f496744ac797a92ecfb9cf1035';
    //var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    $.getJSON(nytimesUrl, function(data){

        //$nytHeaderElem.text('New York Times Articles About ' + marker.title);

        articles = data.response.docs;
        var maxLen = articles.length;
        if (maxLen > 3) {
            maxLen = 3;
        }

        for (var i = 0; i < maxLen; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+
                '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                '<p>' + article.snippet + '</p>'+
            '</li>');
        };

    }).error(function(e){
        $nytElem.text('New York Times Articles Could Not Be Loaded');
    });
}

function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21,34));
    return markerImage;
}

ko.applyBindings(myModel);
