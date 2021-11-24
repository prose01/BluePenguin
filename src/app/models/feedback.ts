import { FeedbackEnum } from "./feedbackEnum";

export class Feedback {
  dateSent: Date;
  dateSeen: Date;
  fromProfileId: string;
  adminProfileId: string;
  feedbackType: FeedbackEnum;
  message: string;
  open: boolean;
  countrycode: string;
  languagecode: string;
}

export interface Feedback {
  dateSent: Date;
  dateSeen: Date;
  fromProfileId: string;
  adminProfileId: string;
  feedbackType: FeedbackEnum;
  message: string;
  open: boolean;
  countrycode: string;
  languagecode: string;
}
