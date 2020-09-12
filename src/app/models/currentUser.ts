import { ImageModel } from './ImageModel';
import { ChatMember } from './ChatMember';
import {
  GenderType,
  SexualOrientationType,
  BodyType,
  SmokingHabitsType,
  HasChildrenType,
  WantChildrenType,
  HasPetsType,
  LivesInType,
  EducationType,
  EducationStatusType,
  EducationLevelType,
  EmploymentStatusType,
  SportsActivityType,
  EatingHabitsType,
  ClotheStyleType,
  BodyArtType
} from '../models/enums';

export class CurrentUser {
  //bookmarks: string[];
  chatMemberslist: Array<ChatMember>;
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
  images: Array<ImageModel>;
  gender: GenderType;
  sexualOrientation: SexualOrientationType;
  body: BodyType;
  smokingHabits: SmokingHabitsType;
  hasChildren: HasChildrenType;
  wantChildren: WantChildrenType;
  hasPets: HasPetsType;
  livesIn: LivesInType;
  education: EducationType;
  educationStatus: EducationStatusType;
  educationLevel: EducationLevelType;
  employmentStatus: EmploymentStatusType;
  sportsActivity: SportsActivityType;
  eatingHabits: EatingHabitsType;
  clotheStyle: ClotheStyleType;
  bodyArt: BodyArtType;
}

export interface CurrentUser {
  //bookmarks: string[];
  chatMemberslist: Array<ChatMember>;
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
  images: Array<ImageModel>;
  gender: GenderType;
  sexualOrientation: SexualOrientationType;
  body: BodyType;
  smokingHabits: SmokingHabitsType;
  hasChildren: HasChildrenType;
  wantChildren: WantChildrenType;
  hasPets: HasPetsType;
  livesIn: LivesInType;
  education: EducationType;
  educationStatus: EducationStatusType;
  educationLevel: EducationLevelType;
  employmentStatus: EmploymentStatusType;
  sportsActivity: SportsActivityType;
  eatingHabits: EatingHabitsType;
  clotheStyle: ClotheStyleType;
  bodyArt: BodyArtType;
}
