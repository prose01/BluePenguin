export class MessageModel {
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
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  message: string;
  dateSent: Date;
  dateSeen: Date;
  doNotDelete: boolean;
}
