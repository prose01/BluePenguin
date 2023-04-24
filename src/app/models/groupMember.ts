import { Profile } from "./profile";

export class GroupMember {
  profileId: string;
  name: string;
  blocked: boolean;
  complains: number;
}

export interface GroupMember extends Profile {
  profileId: string;
  name: string;
  blocked: boolean;
  complains: number;
}
