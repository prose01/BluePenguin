import { Profile } from "./profile";
import { AvatarModel } from './avatarModel'

export class ChatMember {
  profileId: string;
  name: string;
  blocked: boolean;
  avatar: AvatarModel;
}

export interface ChatMember extends Profile {
  profileId: string;
  name: string;
  blocked: boolean;
  avatar: AvatarModel;
}
