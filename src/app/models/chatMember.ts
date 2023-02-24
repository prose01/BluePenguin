import { Profile } from "./profile";

export class ChatMember {
  profileId: string;
  name: string;
  blocked: boolean;
  avatar: {
    initials: string;
    circleColor: string;
  };
}

export interface ChatMember extends Profile {
  profileId: string;
  name: string;
  blocked: boolean;
  avatar: {
    initials: string;
    circleColor: string;
  };
}
