import { GenderType, BodyType } from '../models/enums';

export class CurrentUser {
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

export interface CurrentUser {
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
