
import { ServerConfig } from "../../../config/config";

export class ConversationHandler {

    static async postConversationMessageAsync(conversationClient: any, params: any) {
        const promise = new Promise<any>((reject, resolve) => {
            conversationClient.message(params, (error: any, response: any) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });

        return await promise;
    }
}