
import * as express from 'express';
import * as request from 'request';
import { ServerConfig } from "../../../config/config";
import { ParsedAsJson } from "body-parser";
import { ConversationHandler } from "../conversation/conversation.handler";

declare function require(path: string): any;
const ConversationV1 = require('watson-developer-cloud/conversation/v1');

export class ConversationRouter {
    expressRouter: express.Router;
    conversationClient: any;

    constructor() {
        this.createRouter();
    }

    public getExpressRouter(): express.Router {
        return this.expressRouter;
    }

    private createRouter() {
        //create a router for api routes
        this.expressRouter = express.Router();

        // setup the client for the watson conversation service
        this.conversationClient = new ConversationV1({
            url: 'https://gateway.watsonplatform.net/conversation/api',
            username: ServerConfig.CONVERSATION_API_USERNAME,
            password: ServerConfig.CONVERSATION_API_PASSWORD,
            version_date: '2017-05-26',
            version: 'v1'
        });

        // Add service endpoint allowing clients to interact with the bot
        this.expressRouter.post('/message', this.postMessageHandler(this.conversationClient));
    }

    private postMessageHandler(conversationClient: any) {
        return (req: express.Request & ParsedAsJson, res: express.Response, next: express.NextFunction) => {
            try {
                console.log(ServerConfig.LOG_PREFIX, "Incoming Request: ", req.body.input);
                var workspace = ServerConfig.CONVERSATION_API_WORKSPACE_ID;
                if (!workspace) {
                    console.log(ServerConfig.LOG_PREFIX, "No workspace detected. Cannot run the Watson Conversation service.");
                    res.json({
                        output: {
                            text: 'Conversation initialization in progress. Please try again.'
                        }
                    });
                }

                let params = {
                    workspace_id: workspace,
                    context: {}, // Null context indicates new conversation
                    input: {}    // Holder for message
                };

                // Set input message and context if available
                if (req.body) {
                    if (req.body.input) {
                        params.input = req.body.input;
                    }

                    if (req.body.context) {
                        params.context = req.body.context;
                    }
                }
                try {
                    let response = ConversationHandler.postConversationMessageAsync(conversationClient, params);
                    res.status(200).json(response);
                } catch (e) {
                    console.log(ServerConfig.LOG_PREFIX, "Error when sending message: ", e);
                    res.status(e.code || 500).json(e);
                }
            } catch (e) {
                res.json({
                    output: {
                        text: e
                    }
                });
            }
        }
    }
}