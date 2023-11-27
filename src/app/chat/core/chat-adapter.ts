import { Observable } from 'rxjs';
import { ParticipantResponse } from "./participant-response";
import { IChatParticipant } from './chat-participant';
import { MessageModel } from '../../models/messageModel';

export abstract class ChatAdapter {
  // ### Abstract adapter methods ###

  public abstract listFriends(): Observable<ParticipantResponse[]>;

  public abstract unreadMessages(): Observable<ParticipantResponse[]>;

  public abstract getMessageHistory(destinataryId: any): Observable<MessageModel[]>;

  public abstract sendSaveLastMessagesSeen(chatparticipant: IChatParticipant): Observable<any>;

  public abstract sendMessage(message: MessageModel): void;

  public abstract onDisconnectedAsync(): void;

  // ### Adapter/Chat income/ingress events ###

  public onFriendsListChanged(participantsResponse: ParticipantResponse[]): void {
    this.friendsListChangedHandler(participantsResponse);
  }

  public onMessageReceived(chatparticipant: IChatParticipant, message: MessageModel): void {
    this.messageReceivedHandler(chatparticipant, message);
  }

  // Event handlers
  /** @internal */
  friendsListChangedHandler: (participantsResponse: ParticipantResponse[]) => void = (participantsResponse: ParticipantResponse[]) => { };
  /** @internal */
  messageReceivedHandler: (chatparticipant: IChatParticipant, message: MessageModel) => void = (chatparticipant: IChatParticipant, message: MessageModel) => { };
}
