export class Profile {
  //id: number;
  //_id: string;
  profileId: string;
  name: string;
  updatedOn: string;
  createdOn: string;
  body: string;
  email: string;
}

export interface Profile {
  profileId: string;
  name: string;
  updatedOn: string;
  createdOn: string;
  body: string;
  email: string;
}