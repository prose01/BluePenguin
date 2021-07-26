import { ImageModel } from './imageModel'; 
import { ChatMember } from './chatMember';
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

export class Profile {
  //bookmarks: string[];
  //chatMemberslist: Array<ChatMember>;
  //auth0Id: string;
  profileId: string;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  contactable: boolean;
  description: string;
  imageNumber: number;
  images: Array<ImageModel>;
  tags: string[];
  //gender: string;
  //sexualOrientation: string;
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
  likes: string[];
}

export interface Profile {
  //bookmarks: string[];
  //chatMemberslist: Array<ChatMember>;
  //auth0Id: string;
  profileId: string;
  name: string;
  createdOn: Date;
  updatedOn: Date;
  lastActive: Date;
  age: number;
  height: number;
  contactable: boolean;
  description: string;
  imageNumber: number;
  images: Array<ImageModel>;
  tags: string[];
  //gender: string;
  //sexualOrientation: string;
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
  likes: string[];
}
