import { ImageModel } from './imageModel';
import { Bookmark } from './bookmark';
import { Visited } from './visited';
import { Groups } from './groups';
import { AvatarModel } from './avatarModel'
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
  bookmarks: Array<Bookmark>;
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
  groups: Array<Groups>;
}

export interface CurrentUser {
  languagecode: string;
  countrycode: string;
  bookmarks: Array<Bookmark>;
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
  groups: Array<Groups>;
}
