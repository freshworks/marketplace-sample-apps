
/**
 * Sendgrid API is used to Send mails 
 */
const sgMail = require('@sendgrid/mail');
const htmlMsg = require('./Template').html_msg;
exports = {
  events: [
    { event: "onNewHireCreate", callback: "onNewHireCreateCallback"},
  ],
/**
 * Assigning onNewHireCreateCallback to onNewHireCreate event
 */	
     onNewHireCreateCallback: function(payload) {
	console.log(htmlMsg);
    console.log('payload.iparams.apiKey')
	console.log(payload.iparams.apiKey)
	
    sgMail.setApiKey(payload.iparams.apiKey);

        const msg = {
          to: payload.data.newhire.user_emails[0],
          from: 'sjuhi1818@gmail.com',   
          subject: 'Feedback Form for New Hires',
          text: 'xyz',
          html: htmlMsg,
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
  


  

    
