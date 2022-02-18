import { FeedbackType } from "./feedbackType";

export class Feedback {
  feedbackId: string;
  dateSent: Date;
  dateSeen: Date;
  fromProfileId: string;
  fromName: string;
  adminProfileId: string;
  adminName: string;
  feedbackType: FeedbackType;
  message: string;
  open: boolean;
  countrycode: string;
  languagecode: string;
}

export interface Feedback {
  feedbackId: string;
  dateSent: Date;
  dateSeen: Date;
  fromProfileId: string;
  fromName: string;
  adminProfileId: string;
  adminName: string;
  feedbackType: FeedbackType;
  message: string;
  open: boolean;
  countrycode: string;
  languagecode: string;
}
