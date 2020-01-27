export class CurrentUser {
  //id: number;
  //_id: string;
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

export enum GenderType {
  "Female" = "Female",
  "Male" = "Male"
}

export enum BodyType {
  "Atletic" = "Atletic",
  "Chubby" = "Chubby",
  "Normal" = "Normal",
  "Robust" = "Robust",
  "Slim" = "Slim"
}
