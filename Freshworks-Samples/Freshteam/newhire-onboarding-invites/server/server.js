const AWS = require('aws-sdk');
const sendG = require('@sendgrid/mail');
const bbEndpoint = "https://api.bitbucket.org/1.0/invitations/";

function performOps(args, operation) {
  if (operation.includes("1"))
    sendGrid(args);
  if (operation.includes("2"))
    awsOrg(args);
  if (operation.includes("3"))
    bitBucket(args);
}

function sendGrid(args) {   //FUNCTION FOR SENDGRID
  sendG.setApiKey(args.iparams.sendgrid_key);
  console.log("sendgrid key is: " + args.iparams.sendgrid_key);
  const msg = {
    to: args.data.newhire.official_email,
    from: args['iparams'].mail,
    subject: "Welcome to Freshworks!",
    text: `Hello ` + args.data.newhire.first_name + `!,

Congratulations on being part of the team! The whole company welcomes you and we look forward to a successful journey with you! Welcome aboard!
    
We would like to have you onboard and begin working with you from next Monday. 
    
Given the current pandemic situation - at Freshworks, we've been working from home remotely since March 2020. For the time being, we are operating remotely. We are planning for a phased rollout for our office re-occupation, and hope to have 10% of our workforce back in the office by June. For now, we will proceed to onboard you virtually. 
        
You will need your own laptop to onboard with us for the immediate time being; but once onboarded - based on your location, you can either come to our Chennai office and pick up your work laptop - or if you are not based out of Chennai, we will ship it to your home address.
    
Reach out to me if you have questions. Hope you have a wonderful time here at Freshworks. Cheers! 
    `,
    sandbox_mode: { enable: false },

  };

  sendG.send(msg)
    .then(() => {
      console.log('\nSuccessfully sent Email to: ' + args.data.newhire.official_email + ' using SendGrid');
    })
    .catch((error) => {
      console.error("\ncouldnt send email using sendgrid due to: \n" + error);
    });
}

function awsOrg(args) {  //FUNCTION TO ADD TO AWS ORG
  const config = new AWS.Config({
    accessKeyId: args.iparams.aws_acc,
    secretAccessKey: args.iparams.aws_sec,
    region: 'us-east-1'
  });
  const organizations = new AWS.Organizations(options = config);

  const params = {
    AccountName: args.data.newhire.first_name, /* required */
    Email: args.data.newhire.official_email, /* required */
    RoleName: 'test2',
    Tags: [
      {
        Key: 'email', /* required */
        Value: args.data.newhire.official_email /* required */
      },
    ]
  };

  organizations.createAccount(params, function (err, data) {
    if (err) console.log("\nunable to create account\n" + err.stack); // an error occurred
    else console.log("\nSuccessfully created aws account\n" + data);           // successful response
  }); //// UNCOMMENT LATER  //LIMIT EXCEEDED FOR AWS - ONLY 1 ACCOUNT CAN BE CREATED

}

function bitBucket(args) { //FUNCTION TO INVITE TO BB REPO
  console.log(bbEndpoint + args.iparams.bb_repo);
  $request.post(bbEndpoint + args['iparams'].bb_repo, {
    headers: {
      'Authorization': "Bearer <%= access_token %>", //securely passed 
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    json: {
      "email": args.data.newhire.official_email,
      "permission": "write"
    },
    isOAuth: true,
  }).then(
    function () {
      console.log("\nSuccessfully sent invite to BB repo to the email address " + args.data.newhire.official_email );//+ ". Here's the data: \n" + JSON.stringify(data));
    },
    function (error) {
      console.log("\nUnable to send invitation for the following reason:" + JSON.stringify(error));
    });
}

exports = {
  events: [
    { event: 'onNewHireCreate', callback: 'onNewHireCreateCallback' }
  ],
 
  onNewHireCreateCallback: function (args) {   
    console.log("args are: "+ JSON.stringify(args));
    const dept = args.data.newhire.department_id;
    var url = "https://hamsinisivalenka.freshteam.com/api/departments";
    var headers = {
        "Authorization": "Bearer B4UW3azVMg-ha-CJN0rXjg",
        "accept": "application/json",
    };

    var options = {headers: headers}
    try {
    $request.get(url,options)
    .then (
      function (data)
      {
        let obj = JSON.parse(data.response);
        
        for(let i=0;i<obj.length;i++)
        {
          if(dept == obj[i].id)
          {
            let dept_name = obj[i].name.split(" ").join("-");
            let operation = args['iparams'][dept_name];
            console.log(operation);
            performOps(args, operation);
            break;
          }
        }
      },
      function(error)
      {
        console.log(error);
      });
    }
    catch (error)
    {
      console.log(error);
    }
    
  },
}