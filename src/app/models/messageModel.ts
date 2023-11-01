import { ChatParticipantType } from "../chat/core/chat-participant-type.enum";

export class MessageModel {
  messageType: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  message: string;
  dateSent: Date;
  dateSeen: Date;
  doNotDelete: boolean;
  participantType: ChatParticipantType;
}

export interface IMessageModel {
  messageType: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  message: string;
  dateSent: Date;
  dateSeen: Date;
  doNotDelete: boolean;
  participantType: ChatParticipantType;
}
