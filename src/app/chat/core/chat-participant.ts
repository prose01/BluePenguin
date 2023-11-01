import { ChatParticipantStatus } from "./chat-participant-status.enum";
import { ChatParticipantType } from "./chat-participant-type.enum";

export class ChatParticipant {
  participantType: ChatParticipantType;
  id: any;
  status: ChatParticipantStatus;
  //readonly avatar: string | null;
  displayName: string;
  initials: string;
  initialsColour: string;
  circleColour: string;
}

export interface IChatParticipant {
  participantType: ChatParticipantType;
  id: any;
  status: ChatParticipantStatus;
  //readonly avatar: string | null;
  displayName: string;
  initials: string;
  initialsColour: string;
  circleColour: string;
}
