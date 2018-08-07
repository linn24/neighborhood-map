var map;

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
    var bishanAMK = new google.maps.LatLng(1.3380368, 103.8128534);

    // Constructor creates a new map - only center and zoom are required.
    map = new google.maps.Map(document.getElementById('map'), {
        center: bishanAMK,
        zoom: 13,
        styles: styles,
        mapTypeControl: false
    });

    // Create search request with parameters.
    var request = {
        location: bishanAMK,
        radius: '5000',
        type: ['library'],
        rankby: 'distance'
    };

    placeService = new google.maps.places.PlacesService(map);
    placeService.nearbySearch(request, callback);

    function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {

            // If there is any result returned, clear existing location and marker lists.
            if (results.length > 0) {
                myModel.locationList([]);
                if (myModel.markerList().length > 0) {
                    for (var i = 0; i < myModel.markerList().length; i++) {
                        myModel.markerList()[i].setMap(null);
                    }
                }
                myModel.markerList([]);
            }

            for (var i = 0; i < results.length; i++) {
                var place = results[i];

                // Add each location into location list.
                myModel.locationList.push(new Location({title: place.name, address: place.vicinity}));

                // Create new marker for each location.
                var marker = createMarker(results[i], i);

                // Add marker into marker list
                myModel.markerList.push(marker);
            }
        }
    }

    // Create an InfoWindow so that map will have only 1 window at any time
    var largeInfowindow = new google.maps.InfoWindow();
    myModel.infoWindow(largeInfowindow);

    // Style the markers a bit. This will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('0091ff');

    // Create a "highlighted location" marker color for when the user
    // mouses over the marker.
    var highlightedIcon = makeMarkerIcon('FFFF24');

    function createMarker(place, index) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
            position: placeLoc,
            title: place.name,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: index
        });
        // Create an onclick event to open the large infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow, place.vicinity);
        });
        // Two event listeners - one for mouseover, one for mouseout,
        // to change the colors back and forth.
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        marker.setMap(map);
        return marker;
    }
    // Add event listener for Filter button.
    document.getElementById('btnFilter').addEventListener('click', filterListings);

    function filterListings() {
        var txtName = document.getElementById('txtFilter').value.toLowerCase();

        // Add additional parameter "name" to filter the results.
        request = {
            location: bishanAMK,
            radius: '5000',
            type: ['library'],
            rankby: 'distance',
            name: txtName
        };

        try {
            placeService.nearbySearch(request, callback);
        }
        catch (error) {
            console.log(error.message);
            googleError();
        }

    }
}

function populateInfoWindow(marker, infowindow, address) {

    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        // Clear the infowindow content to give the streetview time to load.
        infowindow.setContent(marker.title + "<br>" + address);
        infowindow.marker = marker;
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });

        // Open the infowindow on the correct marker.
        infowindow.open(map, marker);
    }
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

function googleError() {
    console.log('error occurred');
    alert('An error occurred while retrieving the information from Google Maps API.');
}
