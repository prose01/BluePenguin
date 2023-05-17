import { ImageModel } from './imageModel';
import { ChatMember } from './chatMember';
import { Visited } from './visited';
import { AvatarModel } from './AvatarModel'
import {
  BodyType,
  SmokingHabitsType,
  HasChildrenType,
  WantChildrenType,
  HasPetsType,
  LivesInType,
  EducationType,
  EducationStatusType,
  EmploymentStatusType,
  SportsActivityType,
  EatingHabitsType,
  ClotheStyleType,
  BodyArtType
} from '../models/enums';

export class CurrentUser {
  languagecode: string;
  countrycode: string;
  bookmarks: string[];
  chatMemberslist: Array<ChatMember>;
  //auth0Id: string;
  profileId: string;
  admin: boolean;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  contactable: boolean;
  description: string;
  images: Array<ImageModel>;
  tags: string[];
  gender: string;
  seeking: string[];
  body: BodyType;
  smokingHabits: SmokingHabitsType;
  hasChildren: HasChildrenType;
  wantChildren: WantChildrenType;
  hasPets: HasPetsType;
  livesIn: LivesInType;
  education: EducationType;
  educationStatus: EducationStatusType;
  employmentStatus: EmploymentStatusType;
  sportsActivity: SportsActivityType;
  eatingHabits: EatingHabitsType;
  clotheStyle: ClotheStyleType;
  bodyArt: BodyArtType;
  visited: Array<Visited>;
  likes: string[];
  avatar: AvatarModel;
  groups: string[];
}

export interface CurrentUser {
  languagecode: string;
  countrycode: string;
  bookmarks: string[];
  chatMemberslist: Array<ChatMember>;
  //auth0Id: string;
  profileId: string;
  admin: boolean;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  contactable: boolean;
  description: string;
  images: Array<ImageModel>;
  tags: string[];
  gender: string;
  seeking: string[];
  body: BodyType;
  smokingHabits: SmokingHabitsType;
  hasChildren: HasChildrenType;
  wantChildren: WantChildrenType;
  hasPets: HasPetsType;
  livesIn: LivesInType;
  education: EducationType;
  educationStatus: EducationStatusType;
  employmentStatus: EmploymentStatusType;
  sportsActivity: SportsActivityType;
  eatingHabits: EatingHabitsType;
  clotheStyle: ClotheStyleType;
  bodyArt: BodyArtType;
  visited: Array<Visited>;
  likes: string[];
  avatar: AvatarModel;
  groups: string[];
}
