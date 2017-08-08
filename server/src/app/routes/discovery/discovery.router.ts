
import * as express from 'express';
import { ParsedAsJson } from "body-parser";
import { ServerConfig } from "../../../config/config";

declare function require(path: string): any;
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');

export class DiscoveryRouter {
    expressRouter: express.Router;

    constructor() {
        this.createRouter();
    }

    private createRouter() {
        // create a router for api routes
        this.expressRouter = express.Router();

        // setup the client for calls to watson discovery
        const discoveryClient = new DiscoveryV1({
            username: ServerConfig.DISCOVERY_API_USERNAME,   // Set to your conversation username
            password: ServerConfig.DISCOVERY_API_PASSWORD,   // Set to your conversation password
            version_date: DiscoveryV1.VERSION_DATE_2017_04_27,
        });

        // Add route handlers
        this.expressRouter.post('/query', (req: express.Request & ParsedAsJson, res: express.Response, next: express.NextFunction) => {
            try {
                const params = {
                    environment_id: ServerConfig.DISCOVERY_API_ENVIRONMENT_ID,
                    collection_id: ServerConfig.DISCOVERY_API_COLLECTION_ID,
                    query: req.body.query
                }
                console.log(ServerConfig.LOG_PREFIX, "Incoming Request: ", req.body.query);
                discoveryClient.query(params, (error: any, response: any) => {
                    if (error) {
                        next(error);
                    }

                    if (response.results && response.results.length > 0) {
                        let html: string = response.results[0].html;
                        res.json(html);
                    }

                    res.json({
                        output: {
                            text: "No results found"
                        }
                    });
                });
            } catch (e) {
                res.json({
                    output: {
                        text: e
                    }
                });
            }
        });
    } 

    public getExpressRouter(): express.Router {
        return this.expressRouter;
    }
}

