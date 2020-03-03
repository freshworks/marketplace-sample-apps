$(document).ready(function () {
    app.initialized()
        .then(function (_client) {
            var client = _client;
            client.events.on('app.activated',
                function () {
                    $(document).ready(function () {
                        $("#hide").hide();
                        $(".history-list").hide();
                        $("#check-input").click(function () {
                            let city = $("#input-city").val();
                            let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&units=metric&appid=<%= iparam.apiKey %>';
                            client.request.post(url)
                                .then(
                                    function (result) {
                                        result = JSON.parse(result.response);

                                        $("#t1").text(result.list[0].main.temp + '°C');
                                        $("#w").text(result.list[0].wind.speed + " m/s");
                                        $("#loc").text(result.city.name);

                                        $("#date-day").text(result.list[0].dt_txt.slice(0, 10));

                                        $("#d2").text(result.list[8].dt_txt.slice(8, 10));

                                        $("#d3").text(result.list[16].dt_txt.slice(8, 10));

                                        $("#d4").text(result.list[24].dt_txt.slice(8, 10));

                                        $("#d5").text(result.list[32].dt_txt.slice(8, 10));

                                        let r1 = result.list[8].main.temp.toString();
                                        let r2 = result.list[16].main.temp.toString();
                                        let r3 = result.list[24].main.temp.toString();
                                        let r4 = result.list[32].main.temp.toString();


                                        $("#t2").text(r1.slice(0, 2) + '°C');
                                        $("#t3").text(r2.slice(0, 2) + '°C');
                                        $("#t4").text(r3.slice(0, 2) + '°C');
                                        $("#t5").text(r4.slice(0, 2) + '°C');

                                        $("#s2, #d2, #t2").click(function () {
                                            $("#date-day").text("  " + result.list[8].dt_txt.slice(0, 10) + "  ");
                                            $(".date-dayname").text("Tomorrow");
                                            $("#t1").text(result.list[8].main.temp + '°C');
                                            $("#w").text(result.list[8].wind.speed + " m/s");
                                        });
                                        $("#s3, #d3, #t3").click(function () {
                                            $("#date-day").text("  " + result.list[16].dt_txt.slice(0, 10) + "  ");
                                            $(".date-dayname").text("3rd Day");
                                            $("#t1").text(result.list[16].main.temp + '°C');
                                            $("#w").text(result.list[16].wind.speed + " m/s");
                                        });
                                        $("#s4, #d4, #t4").click(function () {
                                            $("#date-day").text("  " + result.list[24].dt_txt.slice(0, 10) + "  ");
                                            $(".date-dayname").text("4th Day");
                                            $("#t1").text(result.list[24].main.temp + '°C');
                                            $("#w").text(result.list[24].wind.speed + " m/s");
                                        });
                                        $("#s5, #d5, #t5").click(function () {
                                            $("#date-day").text("  " + result.list[32].dt_txt.slice(0, 10) + "  ");
                                            $(".date-dayname").text("5th Day");
                                            $("#t1").text(result.list[32].main.temp + '°C');
                                            $("#w").text(result.list[32].wind.speed + " m/s");
                                        });
                                        $('#past').click(function () {
                                            $("#past").hide();
                                            $("#hide").show();
                                            $(".week-list").hide();
                                            $(".history-list").show();
                                            // client.db.delete("pastSearches").then(function(data){
                                            //     console.log(data);
                                            // },
                                            // function(error){
                                            //     console.log(error, "couldn't delete it");
                                            // });
                                            client.db.get("pastSearches").then(function (data) {
                                                past = data.p1;
                                                if (past.length < 5) {
                                                    past.push(result.city.name);
                                                } else {
                                                    past.shift();
                                                    past.push(result.city.name)
                                                }
                                                // $("#h1").text(past[0]);
                                                // $("#h2").text(past[1]);
                                                // $("#h3").text(past[2]);
                                                // $("#h4").text(past[3]);
                                                // $("#h5").text(past[4]);
                                                past.forEach(function(ele) {
                                                    let blk = `<li>${ele}</li>`;
                                                    $('#history').prepend(blk);
                                                });
                                                $("#hide").click(function () {
                                                    $("#hide").hide();
                                                    $("#past").show();
                                                    $(".week-list").show();
                                                    $(".history-list").hide();
                                                });

                                                client.db.update("pastSearches", "set", {
                                                    "p1": past
                                                }).then(function (data) {
                                                    console.log(data),
                                                    function (error) { console.log(error) }
                                                });

                                            }
                                                , function (error) {
                                                    console.log(error);
                                                    client.db.set("pastSearches", { "p1": [result.city.name] })
                                                        .then(function (data) {
                                                            console.log(data);
                                                        },
                                                            function (error) {
                                                                console.log(error);
                                                            });

                                                });
                                        });

                                    }, function (error) {
                                        console.log(error);
                                        client.interface.trigger("showNotify", {
                                            type: "info",
                                            title: "Invalid",
                                            message: " This city doesn't exist"
                                        })
                                            .then(function (data) {
                                                console.log(data);
                                            }, function (error) {
                                                console.log(error);
                                            });
                                    }
                                );
                        });
                    });
                });
        });
});
