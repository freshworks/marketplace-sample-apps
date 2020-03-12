/**
 * Sendgrid API is used to Send mails 
 */
const sgMail = require('@sendgrid/mail');
exports = {
  events: [
    { event: "onNewHireCreate", callback: "onNewHireCreateCallback"},
  ],
/**
 * Assigning onNewHireCreateCallback to onNewHireCreate event
 */
  onNewHireCreateCallback: function(payload) {
    console.log('payload.iparams.apiKey')
	console.log(payload.iparams.apiKey)
	 sgMail.setApiKey(payload.iparams.apiKey);
        const msg = {
          to: payload.data.newhire.user_emails[0],
          from: 'sjuhi1818@gmail.com',   
          subject: 'Feedback Form for New Hires',
          text: '',
          html: "Hello! Welcome to Freshworks.It's been a month as you have joined the company.We were happy to have you onboard.Hope your experience with us so far has been great. Your feedback on our hiring and on-boarding processes is of paramount importance to better ourselves.We hope you'll help us by taking the survey.Please make some time to fill out the feedback form attached with this email. Hope this suffices",
        };
        sgMail.send(msg);
/**
 *Using Shedule event for sending mail after 30 days
 */
    let d = new Date();
    d.setMonth(d.getMonth()+1);
    $schedule.create({
      name: "ticket_reminder",
      data: {ticket_id: 100001},
      schedule_at: d.toISOString(),
    })
  }
}
  
