import {
  GenderType,
  BodyType,
  SmokingHabitsType,
  HasChildrenType,
  WantChildrenType,
  HasPetsType,
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
  smokingHabits: SmokingHabitsType;
  hasChildren: HasChildrenType;
  wantChildren: WantChildrenType;
  hasPets: HasPetsType;
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
  smokingHabits: SmokingHabitsType;
  hasChildren: HasChildrenType;
  wantChildren: WantChildrenType;
  hasPets: HasPetsType;
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
