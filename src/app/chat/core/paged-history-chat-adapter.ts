import { Observable } from 'rxjs';
import { ChatAdapter } from "./chat-adapter";
import { MessageModel } from '../../models/messageModel';
import { User } from "./user";

/**
 * @description Chat Adapter decorator class that adds pagination to load the history of messagesr. 
 * You will need an existing @see ChatAdapter implementation
 */
export abstract class PagedHistoryChatAdapter extends ChatAdapter {
  abstract getMessageHistoryByPage(destinataryId: any, size: number, page: number): Observable<MessageModel[]>;
}
