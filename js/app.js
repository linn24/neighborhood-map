var Location = function(data) {
    this.title = ko.observable(data.title);
    this.address = ko.observable(data.address);

    this.showInfo = function(parent) {
        // Set current location and marker.
        parent.currentLocation(this);
        parent.currentMarker(parent.markerList()[parent.locationList().indexOf(this)]);

        // Display InfoWindow for current location.
        populateInfoWindow(parent.currentMarker(), parent.infoWindow(), this.address());
    };
}


var ViewModel = function() {
    var self = this;

    this.infoWindow = ko.observable();

    this.locationList = ko.observableArray([]);
    this.markerList = ko.observableArray([]);

    this.currentLocation = ko.observable(this.locationList()[0]);
    this.currentMarker = ko.observable(this.markerList()[0]);
}

var myModel = new ViewModel();

ko.applyBindings(myModel);
