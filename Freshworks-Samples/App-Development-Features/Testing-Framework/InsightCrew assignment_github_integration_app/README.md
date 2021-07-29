Objective of the app -: This app will allow support tickets in Freshdesk to be integrated with issues in GitHub so there can be a closer coordination between the support agents team and the developer team for customer issues.

Steps to install and use the Application -:
1-Register a oauth app on GitHub for your account and note down the “Client Token” and “Secret Key”.
2-Open oauth config file of Freshdesk custom app and enter the “client token” and “secret key” in the corresponding columns.
3-Upload the app in Freshdesk custom apps in your account.
4-On installing the app, it would ask for the following information
1-Username
2-GitHub Repo
3-Freshdesk API key

5-The app is now connected to GitHub. The same can also be checked by looking at “Webhooks” section in GitHub.

6)Add the below three fields in ticket from admin settings section:-
1-github_ticket_id
2-github_ticket_number
3-freshdesk_ticket_id

7)App functionality -:
1-When a new ticket is created in Freshdesk, it creates an issue in corresponding account on GitHub.
2-The ticket type - “Question, Bug or Enhancement” is added as a label in GitHub for that issue.
3-If the ticket type in Freshdesk is changed, the corresponding label in GitHub is updated as well.
4-Any comment/note that is added to Freshdesk ticket is added as a comment to GitHub as well.
5-If a ticket status is marked “closed” in Freshdesk, the status is updated in GitHub as well.
6-Similarly, if an issue status is marked “closed” in GitHub, the ticket is marked “closed” in freshdesk as well.

8)Platform feature used:-
1- Request Api
2- External Event
3- Data Storage
4- Custom Fields
5- Backend Events
