/**
 * Sendgrid API is used to Send mails 
 */
const sgMail = require('@sendgrid/mail');

/**
 * Assigning onNewHireCreateCallback to onNewHireCreate event
 */
exports = {
  events: [
    {
      event: "onNewHireCreate",
      callback: "onNewHireCreateCallback"
    },
    {
      event: "onScheduledEvent",
      callback: "onScheduledEventHandler"
    }],

  onNewHireCreateCallback: function (payload) {
    sgMail.setApiKey(payload.iparams.apiKey);
    const msg = {
      to: payload.data.newhire.user_emails[0],
      from: payload.iparams.Email,
      subject: payload.iparams.Subject,
      Text: payload.iparams.Text + "\n" + payload.iparams.Domain,
    };
    sgMail.send(msg);
  },

  onScheduledEventHandler: function (payload) {
    console.info("Logging arguments from onScheduledEvent: " + JSON.stringify(payload));
    if (payload.data.account_id = 3) {
      let d = new Date();
      d.setMonth(d.getMonth() + 1);
      $schedule.create(
        {
          name: "ticket_reminder",
          data:
          {
            ticket_id: 100001
          },
          schedule_at: d.toISOString(),
        })
    }
  }
}
