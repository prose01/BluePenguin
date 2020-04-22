import { GenderType, BodyType } from '../models/enums';
import { ImageModel } from './ImageModel';

export class Profile {
  bookmarks: string[];
  auth0Id: string;
  profileId: string;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  weight: number;
  description: string;
  gender: GenderType;
  body: BodyType;
  images: Array<ImageModel>;
}

export interface Profile {
  auth0Id: string;
  profileId: string;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  weight: number;
  description: string;
  gender: GenderType;
  body: BodyType;
  images: Array<ImageModel>;
}
