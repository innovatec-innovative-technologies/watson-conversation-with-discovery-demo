import * as request from 'request';
import * as requestPromise from 'request-promise-native';
import * as express from 'express';
import { ServerConfig } from "../../../config/config";

export class DiscoveryHandler {

    static async callDiscoveryAsync(host: string, queryString: string) {
        var options: (request.UriOptions & request.AuthOptions) | (request.UrlOptions & request.CoreOptions) = {
            method: 'POST',
            url: host + '/api/discovery/query',
            form: {
                query: queryString
            }
        };
        return await requestPromise(options);
    }

    delay(milliseconds: number, count: number): Promise<number> {
        return new Promise<number>(resolve => {
            setTimeout(() => {
                resolve(count);
            }, milliseconds);
        });
    }

    // async function always return a Promise
    async dramaticWelcome(): Promise<void> {
        console.log("Hello");

        for (let i = 0; i < 5; i++) {
            // await is converting Promise<number> into number
            const count: number = await this.delay(500, i);
            console.log(count);
        }

        console.log("World!");
    }
}