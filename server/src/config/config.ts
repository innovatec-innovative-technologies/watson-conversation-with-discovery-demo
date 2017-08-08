declare function require(path: string): any; // workaround since at the moment of development there were no typings package for cfenv
var cfenv = require('cfenv');

export class ServerConfig {

    /**
     * Server
     */
    private static appEnv: any;
    private static getAppEnv() {
        if (!this.appEnv) {
            this.appEnv = cfenv.getAppEnv();
        }
        return this.appEnv;
    }
    static PORT: number = ServerConfig.getAppEnv().port;
    static URL: string = ServerConfig.getAppEnv().url;

    /**
     * Logging
     */
    static LOG_PREFIX: string = 'SERVER:';

    /**
     * Conversation API
     */
    static CONVERSATION_API_WORKSPACE_ID: string = process.env.CONVERSATION_WORKSPACE_ID;
    static CONVERSATION_API_USERNAME: string = process.env.CONVERSATION_USERNAME;
    static CONVERSATION_API_PASSWORD: string = process.env.CONVERSATION_PASSWORD;

    /**
     * Discovery API
     */
    static DISCOVERY_API_ENVIRONMENT_ID: string = process.env.DISCOVERY_ENVIRONMENT_ID;
    static DISCOVERY_API_COLLECTION_ID: string = process.env.DISCOVERY_COLLECTION_ID;;
    static DISCOVERY_API_USERNAME: string = process.env.DISCOVERY_USERNAME;
    static DISCOVERY_API_PASSWORD: string = process.env.DISCOVERY_PASSWORD;
} 