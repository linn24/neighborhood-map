var map;
var request;
var largeInfowindow;

var ViewModel = function() {
    var self = this;
    this.markerList = ko.observableArray([]);
    this.searchText = ko.observable('');

    this.slideToggle = function() {
        $(".options-box").animate({
            width: "toggle"
        });
        $("#map").toggleClass("toggled");
    };

    this.showInfo = function(self) {
        google.maps.event.trigger(self, 'click');
        //self.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            self.setAnimation(null); }, 1400);
    };

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

    this.getNYTimesData = function(marker, infowindow, address) {
        var nytimesUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + marker.title + '&sort=newest&api-key=072356f496744ac797a92ecfb9cf1035';

        var articleList = '';
        $.getJSON(nytimesUrl, function(data){
            articles = data.response.docs;
            var maxLen = articles.length;
            if (maxLen > 3) {
                maxLen = 3;
            }

            for (var i = 0; i < maxLen; i++) {
                var article = articles[i];
                articleList += '<li class="article">'+
                    '<a href="'+article.web_url+'">'+article.headline.main+'</a>'+
                    '<p>' + article.snippet + '</p>'+
                '</li>';
            };
            infowindow.setContent(marker.title + "<br>" + address + "<ul id='nytimes-articles' class='article-list'>" + articleList + "</ul>");

        }).error(function(e){
            articleList += 'New York Times Articles Could Not Be Loaded';
            infowindow.setContent(marker.title + "<br>" + address + "<br>" + articleList);
        });

    };
}

var myModel = new ViewModel();

myModel.markerList([]);
myModel.searchText('');
