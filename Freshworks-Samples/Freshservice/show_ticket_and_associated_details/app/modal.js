!(function($) {
    var clientAPP = null,
        targetContainer = "#renderOutput ul",
        $li,
        $label,
        arrayModules = ["associatedTasks", "recentChildTickets", "requesterAssets", "ticketAssets"];//this array is used to check if the data api returns an array of objects
    initModal = function(_client) {
        clientAPP = _client;
        initHandlers();
    };

    /**
     * This function takes in a data and formats it according to its data type for displaying
     * @param _v - the data to be formatted 
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
     * This method gets the corresponding name of the data to be retrieved whenever the navigation button from the dropdown is clicked
     * It retrieves the data using Data API, formats it using another function and then displays it
     * @param {string} module - name of the object to be retrieved 
     */
    getData = function(module) {
        var $targetContainer = $(targetContainer),
            _data;
        $(targetContainer).empty();
        clientAPP.data.get(module)
            .then(function(data) {
                _data = data[module];
                if ($.inArray(module, arrayModules) > -1 && _data.length)
                    _data = _data[0];
                if (_data) {
                    $.each(_data, function(_k, _v) {

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

    /**
     * This function handles the dropdown and pagination and populates the table (output) with coreesponding data.
     */
    initHandlers = function() {
        var targetDirection,
            currentValue,
            nextValue;

        $("select").select2({
            minimumResultsForSearch: 30
        });

        $(document).on("change", "#codeDemo", function() {
            getData($(this).val());
        });

        $("#codeDemo").trigger("change");

        $(".navigation-menu a").on("click", function() {
            currentValue = $("#codeDemo").val();
            targetDirection = $(this).data("target");
            nextValue = $("#codeDemo").find("option[value='" + currentValue + "']")[targetDirection]().val();
            $("#codeDemo").val(nextValue).trigger("change");
            $(".navigation-menu a").removeClass("disabled");
            if ($("#codeDemo").find("option[value='" + nextValue + "']").is(':last-child') || $("#codeDemo").find("option[value='" + nextValue + "']").is(':first-child'))
                $(this).addClass("disabled");
        });
    };

    $(document).ready(function() {
        app.initialized().then(initModal);
    });
})(window.jQuery);