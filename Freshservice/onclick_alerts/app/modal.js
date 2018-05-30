!(function($) {
    var clientAPP = null,
        targetContainer = "#renderOutput ul",
        $li,
        $label,
        $value;
    initModal = function(_client) {
        clientAPP = _client;
        getData();
    };

    flattenToString = function(_v) {
        var swapVariable = "";
        if (typeof _v == "string") {
            _v = _v.trim();
        } else if (Array.isArray(_v)) {
            _v = _v.join(",");
        } else if (typeof _v == "object") {
            swapVariable += "<div class='nested'>" + JSON.stringify(_v) + "</div>";
            _v = swapVariable;
        }
        if (_v == null || _v == "") {
            _v = "-";
        }
        return _v;
    };
    //This method gets the value of associated child tickets and prints the details of the first child ticket.
    getData = function() {
        var $targetContainer = $(targetContainer);
        $(targetContainer).empty();
        clientAPP.data.get("recentChildTickets")
            .then(function(data) {
                console.log("Data", data);
                if (data["recentChildTickets"].length) {
                    $.each(data["recentChildTickets"][0], function(_k, _v) {
                        $label = $("<label>");
                        $label.html(_k).addClass("info");
                        $value = $("<label>");
                        $value.html(flattenToString(_v)).addClass("value");
                        $li = $("<li class='clearfix'>");
                        $li.append($label).append($value);
                        $targetContainer.append($li);
                    });
                }

            })
            .catch(function(e) {
                console.log('Exception - ', e);
            });
    };

    $(document).ready(function() {
        app.initialized().then(initModal);
    });
})(window.jQuery);