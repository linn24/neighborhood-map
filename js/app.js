var stations = [
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

var MRT_Station = function(data) {
    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
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
        parent.currentStation(this);
    };

}


var ViewModel = function() {
    var self = this;

    this.stationList = ko.observableArray([]);

    stations.forEach(function(stationItem) {
        self.stationList.push(new MRT_Station(stationItem));
    });

    this.currentStation = ko.observable(this.stationList()[0]);

/*
    this.incrementCounter = function() {
        //this.currentCat().clickCount(this.currentCat().clickCount() + 1);
        //this.clickCount(this.clickCount() + 1);
        self.currentCat().clickCount(self.currentCat().clickCount() + 1);
    };
*/

}

ko.applyBindings(new ViewModel());
