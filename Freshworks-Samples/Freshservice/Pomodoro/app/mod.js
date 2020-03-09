app.initialized().then(function(_client) {
  let client = _client;
  /** we use the context API to get the data skeleton from app.js  */
  client.instance.context()
    .then(function(context) {

      let hs = context.data.history;
      
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChart);
      function drawChart() {
        // Create the data table.
        var data = new google.visualization.DataTable();

        data.addColumn("number", "Days");
        data.addColumn("number", "No. of sessions");
        data.addColumn("number", "No. of interuptions");
        data.addRows(hs);
        // Set chart options
        var options = {
          title: "Promodo productivity",
          titleposition: "in",
          width: 650,
          height: 500,
          animation: {
            startup: true,
            easing: "inAndOut",
            duration: 1200
          },
          legend: {
              position: "bottom"
          },
          hAxis: {
              title: "no. of days"
          },
          vAxis: {
              title: "no. of sessions / interruptions"
          }
        };

        // Instantiate and draw our chart, passing in some options.
        var chart = new google.visualization.LineChart(
          document.getElementById("chart_div")
        );
        chart.draw(data, options);
      }
    })
    .catch(function(err) {
      console.log(JSON.stringify(err));
    });
});