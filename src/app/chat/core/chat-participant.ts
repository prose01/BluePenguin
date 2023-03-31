import { ChatParticipantStatus } from "./chat-participant-status.enum";
import { ChatParticipantType } from "./chat-participant-type.enum";

export class ChatParticipant {
  readonly participantType: ChatParticipantType;
  readonly id: any;
  readonly status: ChatParticipantStatus;
  //readonly avatar: string | null;
  readonly displayName: string;
  readonly initials: string;
  readonly initialsColour: string;
  readonly circleColour: string;
}

export interface IChatParticipant {
  readonly participantType: ChatParticipantType;
  readonly id: any;
  readonly status: ChatParticipantStatus;
  //readonly avatar: string | null;
  readonly displayName: string;
  readonly initials: string;
  readonly initialsColour: string;
  readonly circleColour: string;
}
