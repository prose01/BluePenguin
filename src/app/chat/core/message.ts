import { ChatParticipantType } from './chat-participant-type.enum';
import { MessageType } from './message-type.enum';

export class Message {
  public type?: MessageType = MessageType.Text;
  public fromId: any;
  public toId: any;
  public message: string;
  public dateSent?: Date;
  public dateSeen?: Date;
  public participantType: ChatParticipantType;
}
