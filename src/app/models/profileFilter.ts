import { GenderType, BodyType } from '../models/enums';

export class ProfileFilter {
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number[];
  height: number[];
  weight: number[];
  description: string;
  gender: GenderType;
  body: BodyType;
}

export interface ProfileFilter {
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number[];
  height: number[];
  weight: number[];
  description: string;
  gender: GenderType;
  body: BodyType;
}
