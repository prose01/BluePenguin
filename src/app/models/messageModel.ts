import { ChatParticipantType } from "../chat/core/chat-participant-type.enum";
import { AvatarModel } from "./avatarModel";

export class MessageModel {
  messageType: string;
  fromId: string;
  fromName: string;
  fromAvatar: AvatarModel;
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
  fromAvatar: AvatarModel;
  toId: string;
  toName: string;
  message: string;
  dateSent: Date;
  dateSeen: Date;
  doNotDelete: boolean;
  participantType: ChatParticipantType;
}
