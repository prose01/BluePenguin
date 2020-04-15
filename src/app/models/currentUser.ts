import { GenderType, BodyType } from '../models/enums';
import { IImageModel } from './ImageModel';

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
  body: BodyType;
  images: Array<IImageModel>;
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
  body: BodyType;
  images: Array<IImageModel>;
}
