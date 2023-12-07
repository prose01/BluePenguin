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

export class ProfileFilter {
  name: string;
  age: number[];
  height: number[];
  description: string;
  tags: string[];
  gender: string;
  body: Array<BodyType>;
  smokingHabits: Array<SmokingHabitsType>;
  hasChildren: Array<HasChildrenType>;
  wantChildren: Array<WantChildrenType>;
  hasPets: Array<HasPetsType>;
  livesIn: Array<LivesInType>;
  education: Array<EducationType>;
  educationStatus: Array<EducationStatusType>;
  employmentStatus: Array<EmploymentStatusType>;
  sportsActivity: Array<SportsActivityType>;
  eatingHabits: Array<EatingHabitsType>;
  clotheStyle: Array<ClotheStyleType>;
  bodyArt: Array<BodyArtType>;
}

export interface ProfileFilter {
  name: string;
  age: number[];
  height: number[];
  description: string;
  tags: string[];
  gender: string;
  body: Array<BodyType>;
  smokingHabits: Array<SmokingHabitsType>;
  hasChildren: Array<HasChildrenType>;
  wantChildren: Array<WantChildrenType>;
  hasPets: Array<HasPetsType>;
  livesIn: Array<LivesInType>;
  education: Array<EducationType>;
  educationStatus: Array<EducationStatusType>;
  employmentStatus: Array<EmploymentStatusType>;
  sportsActivity: Array<SportsActivityType>;
  eatingHabits: Array<EatingHabitsType>;
  clotheStyle: Array<ClotheStyleType>;
  bodyArt: Array<BodyArtType>;
}
