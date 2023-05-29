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
}

export interface MessageModel {
  messageType: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  message: string;
  dateSent: Date;
  dateSeen: Date;
  doNotDelete: boolean;
}
