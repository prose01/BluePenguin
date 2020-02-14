import { GenderType, BodyType } from '../models/enums';

export class Profile {
  bookmarks: string[];
  profileId: string;
  name: string;
  email: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  weight: number;
  description: string;
  gender: GenderType;
  body: BodyType;
}

export interface Profile {
  profileId: string;
  name: string;
  email: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  weight: number;
  description: string;
  gender: GenderType;
  body: BodyType;
}
