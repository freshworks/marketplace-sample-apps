function getExperience(experience) {
  if (experience === "senior_level") {
    return "Senior Level";
  }
}

/**
 * Return the html to render inside the job board
 * by designing it however you want with the data provided
 */
function getJobPost(data) {
  return `
    <div>
        <div>
            <img style="width:50%; height:50%;" src="./assets/job.jpg" alt="JOB">
        </div>
        <span style="color:blue">
        Go to this link to apply for this job - <a target="blank" href="${
          data.applicant_apply_link
        }">JOB LINK</a>
        </span>
        <div style="margin-top: 10px">
            <span style="color:green">JOB DETAILS</span>
            <ul>
                <li> Branch - ${data.branch.city}</li>
                <li> Closing date = ${data.closing_date}</li>
                <li> Experience - ${getExperience(data.experience)} </li>
            </ul>
            <div style="margin-top: 15px">
                ${data.description}
            </div>
        </div>
    </div>
    `;
}

document.addEventListener("DOMContentLoaded", function () {
  app.initialized().then(function (_client) {
    var client = _client;
    client.events.on("app.activated", function () {
      client.data
        .get("jobPosting")
        .then(function (data) {
          console.log("JOB DETAILS DATA: ", data);
          document.getElementById("apptext").innerHTML = getJobPost(data);
        })
        .catch(function (e) {
          console.error("something happened unexpectedly", JSON.stringify(e));
        });
    });
  });
});
