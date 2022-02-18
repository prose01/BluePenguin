import { FeedbackType } from "./feedbackType";

export class FeedbackFilter {
  feedbackId: string;
  dateSentStart: Date;
  dateSentEnd: Date;
  dateSeenStart: Date;
  dateSeenEnd: Date;
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

export interface FeedbackFilter {
  feedbackId: string;
  dateSentStart: Date;
  dateSentEnd: Date;
  dateSeenStart: Date;
  dateSeenEnd: Date;
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
