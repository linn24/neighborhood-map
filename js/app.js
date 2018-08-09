var map;
var request;
var largeInfowindow;

var ViewModel = function() {
    var self = this;
    this.markerList = ko.observableArray([]);
    this.searchText = ko.observable('');

    this.showInfo = function(self) {
        google.maps.event.trigger(self, 'click');
        self.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.setAnimation(null); }, 1400);
    }

    this.filteredMarkerList = ko.computed(function() {
        if (self.searchText() == '') {
            self.markerList().forEach(function(item) {
                item.setVisible(true);
            });
            return self.markerList();
        }
        else {
            var filtered = ko.utils.arrayFilter(self.markerList(), function(item) {
                var isMatched = (item.title.toLowerCase().indexOf(self.searchText().toLowerCase()) > -1);
                item.setVisible(isMatched);
                return isMatched;
            })

            return filtered;
        }
    });
}

var myModel = new ViewModel();

myModel.markerList([]);
myModel.searchText('');
