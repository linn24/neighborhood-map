/*
var locations = [
    {
        title: 'Woodlands',
        location: {lat: 1.4369416, lng: 103.7863953},
        address: 'Q30, Woodlands Ave 2, Singapore'
    },
    {
        title: 'Bartley',
        location: {lat: 1.3422592, lng: 103.8802886},
        address: '212 Upper Paya Lebar Road, 534881, Upper Paya Lebar Road'
    },
    {
        title: 'Esplanade',
        location: {lat: 1.2939413, lng: 103.8553744},
        address: '90 Bras Basah Road'
    },
    {
        title: 'Nicoll Highway MRT Station',
        location: {lat: 1.3002399, lng: 103.8635784},
        address: '20 Republic Ave'
    },
    {
        title: 'Kent Ridge MRT Station',
        location: {lat: 1.2924896, lng: 103.7848814},
        address: '301 South Buona Vista Road'
    }

];
*/
var Location = function(data) {
    this.title = ko.observable(data.title);
    //this.location = ko.observable(data.location);
    this.address = ko.observable(data.address);

/*
    this.title = ko.computed(function() {
        var title;
        var clicks = this.clickCount();
        if (clicks < 10) {
            title = 'Newborn';
        }
        else if (clicks < 20) {
            title = 'Infant';
        }
        else if (clicks < 30) {
            title = 'Teen';
        }
        else if (clicks < 50) {
            title = 'Adult';
        }
        else {
            title = 'Ninja';
        }
        return title;
    }, this);
*/
    this.showInfo = function(parent) {
        parent.currentLocation(this);
        parent.currentMarker(parent.markerList()[parent.locationList().indexOf(this)]);
        //parent.currentMarker().trigger("click");
        console.log('current marker: ' + parent.currentMarker());
        console.log('Index: ' + parent.locationList().indexOf(this));
        populateInfoWindow(parent.currentMarker(), parent.infoWindow(), this.address());
    };

}


var ViewModel = function() {
    var self = this;

    this.infoWindow = ko.observable();
    this.locationList = ko.observableArray([]);
    this.markerList = ko.observableArray([]);

    console.log("locationList (inside ViewModel): " + this.locationList().length);
    console.log("markerList (inside ViewModel): " + this.markerList().length);
    // locations.forEach(function(locationItem) {
    //     self.locationList.push(new Location(locationItem));
    // });

    this.currentLocation = ko.observable(this.locationList()[0]);
    this.currentMarker = ko.observable(this.markerList()[0]);

/*
    this.incrementCounter = function() {
        //this.currentCat().clickCount(this.currentCat().clickCount() + 1);
        //this.clickCount(this.clickCount() + 1);
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };
*/

}
var myModel = new ViewModel();

ko.applyBindings(myModel);
