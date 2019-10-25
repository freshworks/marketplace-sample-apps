/**
 * @module modal
 */
!(function($) {
    var clientAPP = null,
        targetContainer = "#renderOutput ul",
        $li,
        $label,
        $value;

    /**
     * Entry point after the modal page is initialized
     * 
     * @param {Object} _client - The client object used to communicate with the parent page and access APIs
     * @memberof module:modal
     */
    initModal = function(_client) {
        clientAPP = _client;
        getData();
    };

    /**
     * Flattens the input object into string
     * 
     * @param {*} _v - The object which needs to be flattened to a string
     * @returns {String} - Hyphen if input is null or empty, trimmed string if string, comma separated string if array, HTML content if otherwise
     * @memberof module:modal
     */
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

    /**
     * Gets the associated child tickets and shows the details of the most recent child ticket
     * 
     * @memberof module:modal
     */
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