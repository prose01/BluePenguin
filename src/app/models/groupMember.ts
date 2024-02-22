import { AvatarModel } from "./avatarModel";

export class GroupMember {
  profileId: string;
  name: string;
  avatar: AvatarModel;
  blocked: boolean;
  complains: string[];
}

export interface GroupMember {
  profileId: string;
  name: string;
  avatar: AvatarModel;
  blocked: boolean;
  complains: string[];
}
