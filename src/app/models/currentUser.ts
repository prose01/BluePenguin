import { GenderType, SexualOrientationType, BodyType } from '../models/enums';
import { ImageModel } from './ImageModel';
import { ChatMember } from './ChatMember';

export class CurrentUser {
  auth0Id: string;
  profileId: string;
  admin: boolean;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  weight: number;
  description: string;
  gender: GenderType;
  sexualOrientation: SexualOrientationType;
  body: BodyType;
  images: Array<ImageModel>;
  chatMemberslist: Array<ChatMember>;
}

export interface CurrentUser {
  auth0Id: string;
  profileId: string;
  admin: boolean;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  weight: number;
  description: string;
  gender: GenderType;
  sexualOrientation: SexualOrientationType;
  body: BodyType;
  images: Array<ImageModel>;
  chatMemberslist: Array<ChatMember>;
}
