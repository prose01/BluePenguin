import { ImageModel } from './ImageModel';
import { ChatMember } from './ChatMember';
import {
  GenderType,
  SexualOrientationType,
  BodyType,
  SmokingHabitsType,
  LocationType,
  EducationType,
  EducationStatusType,
  EducationLevelType,
  EmploymentStatusType,
  SportsActivityType,
  EatingHabitsType,
  ClotheStyleType,
  BodyArtType
} from '../models/enums';

export class Profile {
  bookmarks: string[];
  chatMemberslist: Array<ChatMember>;
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
  images: Array<ImageModel>;
  gender: GenderType;
  sexualOrientation: SexualOrientationType;
  body: BodyType;
  smokingHabits: SmokingHabitsType;
  hasChildren: boolean;
  wantChildren: boolean;
  hasPets: boolean;
  livesIn: LocationType;
  education: EducationType;
  educationStatus: EducationStatusType;
  educationLevel: EducationLevelType;
  employmentStatus: EmploymentStatusType;
  sportsActivity: SportsActivityType;
  eatingHabits: EatingHabitsType;
  clotheStyle: ClotheStyleType;
  bodyArt: BodyArtType;
}

export interface Profile {
  bookmarks: string[];
  chatMemberslist: Array<ChatMember>;
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
  images: Array<ImageModel>;
  gender: GenderType;
  sexualOrientation: SexualOrientationType;
  body: BodyType;
  smokingHabits: SmokingHabitsType;
  hasChildren: boolean;
  wantChildren: boolean;
  hasPets: boolean;
  livesIn: LocationType;
  education: EducationType;
  educationStatus: EducationStatusType;
  educationLevel: EducationLevelType;
  employmentStatus: EmploymentStatusType;
  sportsActivity: SportsActivityType;
  eatingHabits: EatingHabitsType;
  clotheStyle: ClotheStyleType;
  bodyArt: BodyArtType;
}
