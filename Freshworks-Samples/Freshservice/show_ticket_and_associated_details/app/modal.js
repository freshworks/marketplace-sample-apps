!(function() {
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
        var $targetContainer = document.getElementById('renderOutput').getElementsByTagName('ul'),
            _data;
        document.getElementById('renderOutput').getElementsByTagName('ul').empty();
        clientAPP.data.get(module)
            .then(function(data) {
                _data = data[module];
                if (arrayModules.indexOf(module) > -1 && _data.length)
                    _data = _data[0];
                if (_data) {
                    _data.forEach(function(_k, _v){
                        $label = document.getElementsByTagName('label');
                        $label.html(_k).addClass("info");
                        $value = document.getElementsByTagName('label');
                        $value.html(flattenToString(_v)).addClass("value");
                        $li = document.getElementsByClassName('clearfix');
                        $li.append($label).append($value);
                        $targetContainer.append($li);
                    }) 
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

        document.getElementsByName('select').select2({
            minimumResultsForSearch: 30
        });

        document.addEventListener('change', function(event) {
            event.preventDefault();
            if (event.target.id === 'codeDemo') {
                getData(this.event.val());
            }
        })

        document.getElementById('codeDemo').trigger('change');

        document.getElementsByClassName('navigation-menu').addEventListener('click', function(event) {
            event.preventDefault();
            currentValue = document.getElementById('codeDemo').val();
            targetDirection = this.event.data('target');
            nextValue = document.getElementById('codeDemo').find("option[value='" + currentValue + "']")[targetDirection]().val();
            document.getElementById('codeDemo').val(nextValue).trigger('change');
            this.removeClass('disabled');
            if ( document.getElementById('codeDemo').find("option[value='" + nextValue + "']").is(':last-child') ||
                document.getElementById('codeDemo').find("option[value='" + nextValue + "']").is(':first-child')) {
                    this.addClass('disabled');
                }
        })
    };

    document.addEventListener('DOMContentLoaded', function(event) {
        app.initialized().then(initAPP);
    })
});