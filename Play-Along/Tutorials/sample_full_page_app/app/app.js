/**
 * @desc - This is full page app shows you a bar graph of ticket count grouped
 * by the status and also lists the tickets based on the selected status.
 *
 *
 * 1 - Uses Data API to get the `doaminName` info
 * 2 - Interface API to navigate to a ticket details page
 *
 */

document.addEventListener("DOMContentLoaded", function () {
  /** Tiggered when Page is loaded for the first time
   * @fires , @async - app.initialized()
   */
  app
    .initialized()
    .then((_client) => {
      // Obtains client object
      const client = _client;
      /** @fires - Interface API - A danger notification with 'msg' is shown  */
      function showError(msg) {
        client.interface.trigger("showNotify", {
          type: "danger",
          message: msg,
        });
      }
      /** Triggered when App is used/activated
       * @fires - Data API to collect domain name of the agent and invokes
       * getData() function.
       * Update Domain Name into the template.html's `#domain .label` element
       * @async
       */
      client.events.on("app.activated", () => {
        client.data.get("domainName").then(
          (data) => {
            document.querySelector("#domain .label").innerHTML =
              data.domainName;
            getData(data.domainName);
          },
          (err) => {
            showError("User domainName request failed.");
            console.error("User domainName request failed.", err);
          }
        );
      });

      /**
       * @description - Go and get json data, and pass it on to render() for
       * further Processing.
       * @fires - Request API's GET request with authentication
       *
       * @param - string, domainName
       */

      function getData(domainName) {
        const options = {
          headers: {
            Authorization: "Basic <%= encode(iparam.api_key) %>",
            "Content-Type": "application/json",
          },
        };

        const STATUS_CODES = [2, 3, 4, 5];

        Promise.all(
          STATUS_CODES.map((status) => {
            const url = `https://${domainName}/api/v2/search/tickets?query="status:${status}"`;
            return client.request.get(url, options);
          })
        )
          .then((responses) => {
            render(responses);
          })
          .catch((err) => {
            showError("API request(s) failed.");
            console.error("API request(s) failed.", err);
          });
      }

      function render(responses) {
        /** Convert JSON String into Javascript Object */
        const data = responses.map((r) => JSON.parse(r.response));
        const max = Math.max(...data.map((d) => d.total));

        data.forEach((res, i) => {
          const statusBar = document.getElementsByClassName("status-bar");
          statusBar[i].style.height = `${parseInt((res.total * 100) / max)}%`;
          const statusValue = document.getElementsByClassName("status-value");
          statusValue[i].innerHTML = res.total;
        });

        document
          .querySelector(".status")
          .addEventListener("click", function () {
            document.getElementById("chart").classList.add("minimize");
            document.querySelector(".status").classList.remove("active");
            this.classList.add("active");
            const tickets = data[this.dataset.index].results;

            const html = `
          <table>
            <tbody>
              ${tickets
                .map(function (ticket) {
                  return `
                  <tr class="ticket" data-id="${ticket.id}">
                    <td class="subject">${ticket.subject}</td>
                    <td class="priority priority-${ticket.priority}">
                      ${
                        [, "Low", "Medium", "High", "Urgent"][
                          ticket.priority
                        ] || "N/A"
                      }
                    </td>
                    <td class="created-at">${new Date(
                      ticket.created_at
                    ).toDateString()}</td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
        `;
            document.getElementById("teticket-listxt").innerHTML = html;
            document
              .querySelector(".ticket")
              .addEventListener("click", function () {
                client.interface.trigger("click", {
                  id: "ticket",
                  value: +this.dataset.id,
                });
              });
          });
      }
    })
    .catch((err) => {
      console.error("App activation failed.", err);
    });
});
