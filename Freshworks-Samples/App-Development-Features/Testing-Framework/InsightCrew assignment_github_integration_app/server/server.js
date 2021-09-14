'use strict';

exports = {
    /**
     * Handler for onAppInstall event
     *
     * A webhook url is created through generateTargetUrl function
     * The generated url is registered with GitHub for "issues" related events
     * On successful registration, the webhook URL is stored using $db
     *
     * @param {object} args - payload
     */
    onInstallHandler: function(args)
    {
        generateTargetUrl()
            .then(function(targetUrl)
            {
                $request.post(`https://api.github.com/repos/${args.iparams.github_username}/${args.iparams.github_repo_name}/hooks`,
                    {
                        headers:
                        {
                            Authorization: 'token <%= access_token %>',
                            'User-Agent': 'Awesome-Octocat-App'
                        },
                        isOAuth: true,
                        json:
                        {
                            name: 'web',
                            active: true,
                            events: [
                                'issues'
                            ],
                            config:
                            {
                                url: targetUrl,
                                content_type: 'json'
                            }
                        }
                    })
                    .then(data =>
                    {
                        $db.set('githubWebhookId',
                            {
                                url: data.response.url
                            })
                            .then(function()
                            {
                                console.log('Successfully stored the webhook in the db');
                                renderData();
                            }, error =>
                            {
                                console.log('Error in storing the webhook URL in the db');
                                renderData(
                                {
                                    message: error
                                });
                            });
                    }, error =>
                    {
                        console.log('Error in registering the webhook for GitHub repo');
                        renderData(
                        {
                            message: error
                        });
                    })
            })
            .fail(function()
            {
                console.log('Error in generating the webhook');
                renderData(
                {
                    message: 'The webhook registration failed'
                });
            });
    },

    /**
     * Handler for onAppUninstall event
     *
     * Gets the webhook URL from the data storage through $db that was stored during installation
     * Then deregister the webhook from GitHub with the URL over REST API
     *
     */
    /* istanbul ignore next */
    onUnInstallHandler: function()
    {
        $db.get('githubWebhookId')
            .then(function(data)
            {
                $request.delete(data.url,
                    {
                        headers:
                        {
                            Authorization: 'token <%= access_token %>',
                            'User-Agent': 'Awesome-Octocat-App',
                            Accept: 'application/json'
                        },
                        isOAuth: true
                    })
                    .then(() =>
                    {
                        console.log('Successfully deregistered the webhook for GitHub repo');
                        renderData();
                    }, () => renderData())
            }, error =>
            {
                console.log('Error in getting the stored webhook URL from the db');
                renderData(
                {
                    message: error
                });
            });
    },

    /**
     * Handler for onExternalEvent event
     *
     * Checks if the received issue event is of action 'opened' which is received for new issue creation.
     * Creates a ticket in freshdesk with the issue title and description.
     *
     * @param {object} payload - payload with the data from the third-party applications along with iparams and other metadata
     */
    onWebhookCallbackHandler: function(payload)
    {
        const payloadData = typeof payload.data === 'string' ? JSON.parse(payload.data) : payload.data;
        /** console.log(`https://${payload.domain}/api/v2/search/tickets?query="cf_github_ticket_id:${payloadData.issue.id}`);
         * Filter api not working as expected for custom fields
         */

        $request.get(`https://${payload.domain}/api/v2/tickets`,
            {
                headers:
                {
                    Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
                }
            })
            .then((data) =>
            {
                const ticketsData = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
                var ticket = ticketsData.filter(function(x)
                {
                    return x.custom_fields.cf_github_ticket_id == payloadData.issue.id;
                });
                if (payloadData.action == "closed")
                {
                    $request.put(`https://${payload.domain}/api/v2/tickets/${ticket[0].id}`,
                    {
                        headers:
                        {
                            Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
                        },
                        json:
                        {
                            status: 5
                        }
                    }).then(() =>
                    {
                        console.info('Successfully updated status of ticket in Freshdesk');
                    }, error =>
                    {
                        console.error('Error in updating status of ticket in Freshdesk');
                        renderData(
                        {
                            message: error
                        });
                    })
                }
                else
                {
                    console.info("Github event not handelled.");
                }

            }, (error) =>
            {
                console.error('Error in closing ticket in Freshdesk');
                renderData(
                {
                    message: error
                });
            })

    },

    /**
     * Handler for onTicketCreate event
     *
     * Creates an issue in github with the same description,title and label as in freshdesk
     *
     * @param {object} args - payload
     */
    onTicketCreateHandler: function(args)
    {
        const payloadData = typeof args.data === 'string' ? JSON.parse(args.data) : args.data;
        let label = [];
        label.push(payloadData.ticket.type);
        $request.post(`https://api.github.com/repos/${args.iparams.github_username}/${args.iparams.github_repo_name}/issues`,
            {
                headers:
                {
                    Authorization: 'token <%= access_token %>',
                    'User-Agent': 'Awesome-Octocat-App'
                },
                isOAuth: true,
                json:
                {
                    'title': payloadData.ticket.subject,
                    'body': payloadData.ticket.description_text,
                    'labels': label

                }
            })
            .then(data =>
            {
                $request.put(`https://${args.domain}/api/v2/tickets/${payloadData.ticket.id}`,
                    {
                        headers:
                        {
                            Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
                        },
                        json:
                        {
                            "custom_fields":
                            {
                                "cf_freshdesk_ticket_id": payloadData.ticket.id,
                                "cf_github_ticket_number": data.response.number,
                                "cf_github_ticket_id": data.response.id
                            },

                        }
                    })
                    .then(() =>
                    {
                        console.info('Successfully updated custom fields of ticket in Freshdesk');
                    }, error =>
                    {
                        console.error('Error in updating custom fields of ticket in Freshdesk');
                    })
            }, error =>
            {
                console.error('Error in creating ticket in Github');
            })
    },

    /**
     * Handler for onTicketUpdate event
     *
     * Update an issue status and label in github as per the change made in freshdesk
     * If the status of freshdesk ticket is marked as closed then the github ticket is also marked as closed
     * @param {object} args - payload
     */
    onTicketUpdateHandler: function(args)
    {
        const payloadData = typeof args.data === 'string' ? JSON.parse(args.data) : args.data;
        const freshdesk_ticket_id_field = `cf_freshdesk_ticket_id_${args.account_id}`;
        $request.get(`https://${args.domain}/api/v2/tickets/${payloadData.ticket.custom_fields[freshdesk_ticket_id_field]}`,
            {
                headers:
                {
                    Authorization: '<%= encode(iparam.freshdesk_api_key) %>'
                }
            })
            .then((data) =>
            {
                const ticketData = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
                let label = [];
                label.push(ticketData.type);
                const state = (ticketData.status == 5) ? "closed" : "open";
                $request.patch(`https://api.github.com/repos/${args.iparams.github_username}/${args.iparams.github_repo_name}/issues/${ticketData.custom_fields.cf_github_ticket_number}`,
                    {
                        headers:
                        {
                            Authorization: 'token <%= access_token %>',
                            'User-Agent': 'Awesome-Octocat-App'
                        },
                        isOAuth: true,
                        json:
                        {
                            'title': ticketData.subject,
                            'labels': label,
                            'state': state
                        }

                    })
                    .then(() =>
                    {
                        console.info('Successfully updated ticket in github');

                    }, (error) =>
                    {
                        console.error('Error in updating ticket in github');
                        renderData(
                        {
                            message: error
                        });
                    })

            }, (error) =>
            {
                console.error('Error in finding the github ticket id to update');
                renderData(
                {
                    message: error
                });

            })
    },

    /**
     * Handler for onConversationCreate event
     * If a note/reply is added in freshdesk ticket then the same is added as a comment in github
     * @param {object} args - payload
     */
    onConversationCreateHandler: function(args)
    {
        const payloadData = typeof args.data === 'string' ? JSON.parse(args.data) : args.data;
        $request.get(`https://${args.domain}/api/v2/tickets/${payloadData.conversation.ticket_id}`,
            {
                headers:
                {
                    Authorization: '<%= encode(iparam.freshdesk_api_key) %>',
                    'User-Agent': 'Awesome-Octocat-App'
                }
            })
            .then((data) =>
            {
                const ticketData = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;
                $request.post(`https://api.github.com/repos/${args.iparams.github_username}/${args.iparams.github_repo_name}/issues/${ticketData.custom_fields.cf_github_ticket_number}/comments`,
                    {
                        headers:
                        {
                            Authorization: 'token <%= access_token %>',
                            'User-Agent': 'Awesome-Octocat-App'
                        },
                        isOAuth: true,
                        json:
                        {
                            body: payloadData.conversation.body_text
                        }
                    })
                    .then(() =>
                    {
                        console.info("Comment added successfully in github");
                    }, (error) =>
                    {
                        console.error("Error in adding comment in github")
                        renderData(
                        {
                            message: error
                        });
                    });

            }, (error) =>
            {
                console.error("Error in finding the github ticket id for adding comment");
                renderData(
                {
                    message: error
                });
            })
    }

}
