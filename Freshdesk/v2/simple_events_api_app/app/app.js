/**
 * @desc - Whenever an agent clicks on the send reply button in the ticket
 * details page, this app displays a success notification.
 */
$(document).ready( () => {
  /** Promise .then()
   * @param - resolve block, reject block
   */
  app.initialized().then((_client) => { // Obtains a Client Object
    var client = _client;
    /** [on eventCallback is triggered]
     * 1. Interface API is used.
     * 2. title field supports on 30 characters
     * Result: Notification appears on the right top corner with the 'title'
     * and 'description'
      */
    var eventCallback = () => {
      client.interface.trigger("showNotify", {
        type: "success",
        message: {
          title: "Success",
          description: "Your message has been sent"
        }
      });
    };
    /** Agent Clicking on 'Send' button(event), 'eventCallback' method is invoked.  */
    client.events.on("ticket.sendReply", eventCallback);
  },()=>{ 
    client.interface.trigger("showNotify",{
      type:"warning",
      message:{
        title: "Failed to connect",
        description:"Error: Your message has not been sent"
      }
    });
    console.log("Failed to get");
  });

});
