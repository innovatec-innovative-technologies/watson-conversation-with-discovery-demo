import * as path from "path"; // normalize the paths : http://stackoverflow.com/questions/9756567/do-you-need-to-use-path-join-in-node-js
import * as express from 'express';
import { DiscoveryRouter } from "./discovery/discovery.router";
import { ConversationRouter } from "./conversation/conversation.router";
import { ServerConfig } from "../../config/config";

export class KommuneBotRouter {
    private expressRouter: express.Router;

    constructor() {
        this.configRoutes();
    }
 
    private configRoutes() {
        console.log(ServerConfig.LOG_PREFIX, "Creating router for base paths");
        this.expressRouter = express.Router();

        console.log(ServerConfig.LOG_PREFIX, "Setting up conversation api routes");
        let conversationApiRouter = new ConversationRouter();
        this.expressRouter.use('/api/conversation', conversationApiRouter.getExpressRouter());

        console.log(ServerConfig.LOG_PREFIX, "Setting up conversation api routes");
        let discoveryApiRouter = new DiscoveryRouter();
        this.expressRouter.use('/api/discovery', discoveryApiRouter.getExpressRouter());
    }

    public getRouter(): express.Router {
        return this.expressRouter;
    }
}

