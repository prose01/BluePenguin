export class ChatFilter {
  dateSentStart: Date;
  dateSentEnd: Date;
  dateSeenStart: Date;
  dateSeenEnd: Date;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  message: string;
  doNotDelete: boolean;
}

export interface ChatFilter {
  dateSentStart: Date;
  dateSentEnd: Date;
  dateSeenStart: Date;
  dateSeenEnd: Date;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  message: string;
  doNotDelete: boolean;
}
