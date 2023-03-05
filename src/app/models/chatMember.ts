import { Profile } from "./profile";

export class ChatMember {
  profileId: string;
  name: string;
  blocked: boolean;
}

export interface ChatMember extends Profile {
  profileId: string;
  name: string;
  blocked: boolean;
}
