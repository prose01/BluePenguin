import { GenderType, BodyType } from '../models/enums';

export class CurrentUser {
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
}

export interface CurrentUser {
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
}
