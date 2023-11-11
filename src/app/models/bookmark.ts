import { Profile } from "./profile";
import { AvatarModel } from './avatarModel'

export class Bookmark {
  profileId: string;
  name: string;
  blocked: boolean;
  avatar: AvatarModel;
  isBookmarked: boolean;
}

export interface Bookmark extends Profile {
  profileId: string;
  name: string;
  blocked: boolean;
  avatar: AvatarModel;
  isBookmarked: boolean;
}
