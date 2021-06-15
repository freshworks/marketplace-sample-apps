const {
  OrganizationsClient,
  CreateAccountCommand,
} = require("@aws-sdk/client-organizations");
const sendG = require("@sendgrid/mail");

function performOperations(args, operation) { 
  if (operation.includes("1")) sendWelcomeMail(args);
  if (operation.includes("2")) addToAWSOrg(args);
  if (operation.includes("3")) inviteToBitBucket(args);
}

/*Sends email to Newhire using Sendgrid*/
function sendWelcomeMail(args) {
  sendG.setApiKey(args["iparams"].sendgrid_key);
  const emailCont =
    `Hello ` +
    args.data.newhire.first_name +
    `!,
  Congratulations on being part of the team! The whole company welcomes you and we look forward to a successful journey with you! Welcome aboard!
  We would like to have you onboard and begin working with you from next Monday. 
  Given the current pandemic situation - at Freshworks, we've been working from home remotely since March 2020. For the time being, we are operating remotely. We are planning for a phased rollout for our office re-occupation, and hope to have 10% of our workforce back in the office by June. For now, we will proceed to onboard you virtually. 
  You will need your own laptop to onboard with us for the immediate time being; but once onboarded - based on your location, you can either come to our Chennai office and pick up your work laptop - or if you are not based out of Chennai, we will ship it to your home address.
  Reach out to me if you have questions. Hope you have a wonderful time here at Freshworks. Cheers! 
  `;
  const msg = {
    to: args.data.newhire.official_email,
    from: args["iparams"].mail,
    subject: "Welcome to Freshworks!",
    text: emailCont,
    sandbox_mode: { enable: false },
  };

  sendG
    .send(msg)
    .then(() => {
      console.info(
        "\nSuccessfully sent Email to: " +
          args.data.newhire.official_email +
          " using SendGrid"
      );
    })
    .catch((error) => {
      console.error("\ncouldnt send email using sendgrid due to: \n" + error);
    });
}

/* Adds Newhire to AWS Organisation using AWS-SDK*/
function addToAWSOrg(args) {
  const organizations = new OrganizationsClient({
    credentials: {
      accessKeyId: args["iparams"].aws_acc,
      secretAccessKey: args["iparams"].aws_sec,
    },
    region: "us-east-1",
  });

  const params = {
    AccountName: args.data.newhire.first_name,
    Email: args.data.newhire.official_email,
    Tags: [
      {
        Key: "email",
        Value: args.data.newhire.official_email,
      },
    ],
  };

  const command = new CreateAccountCommand(params);
  organizations
    .send(command)
    .then((data) => {
      console.info("Successfully created AWS account\n" + data);
    })
    .catch((error) => {
      console.error("Couldn't create AWS account\n" + error.stack);
    });
}

/*Sends invite to BitBucket Repository to the newhire*/
function inviteToBitBucket(args) {
  const bbEndpoint = "https://api.bitbucket.org/1.0/invitations/";
  $request
    .post(bbEndpoint + args["iparams"].bb_repo, {
      headers: {
        Authorization: "Bearer <%= access_token %>", //securely passed
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      json: {
        email: args.data.newhire.official_email,
        permission: "write",
      },
      isOAuth: true,
    })
    .then(
      function () {
        console.info(
          "\nSuccessfully sent invite to BB repo to the email address " +
            args.data.newhire.official_email
        );
      },
      function (error) {
        console.error(
          "\nUnable to send invitation for the following reason:" +
            JSON.stringify(error)
        );
      }
    );
}

exports = {
  events: [{ event: "onNewHireCreate", callback: "onNewHireCreateCallback" }],

  onNewHireCreateCallback: function (args) {
    const dept = args.data.newhire.department_id;
    const url = `https://${args["iparams"].ft_domain}.freshteam.com/api/departments`;
    const headers = {
      Authorization: `Bearer ${args["iparams"].ft_api}`,
      accept: "application/json",
    };

    const options = { headers: headers };

    $request.get(url, options).then(
      function (data) {
        let obj = JSON.parse(data.response);
        for (let i = 0; i < obj.length; i++) {
          if (dept == obj[i].id) {
            let dept_name = obj[i].name.split(" ").join("-");
            let operation = args["iparams"][dept_name];
            performOperations(args, operation); 
            break;
          }
        }
      },
      function (error) {
        console.error(
          "Couldn't fetch operations to be performed\n" + JSON.stringify(error)
        );
      }
    );
  },
};
