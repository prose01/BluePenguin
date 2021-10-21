export class MessageModel {
  fromId: string;
  toId: string;
  message: string;
  dateSent: Date;
  dateSeen: Date;
}

export interface MessageModel {
  fromId: string;
  toId: string;
  message: string;
  dateSent: Date;
  dateSeen: Date;
}
