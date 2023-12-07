import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import {
  GenderType,
  BodyArtType,
  BodyType,
  ClotheStyleType,
  EatingHabitsType,
  EducationStatusType,
  EducationType,
  EmploymentStatusType,
  HasChildrenType,
  HasPetsType,
  LivesInType,
  SmokingHabitsType,
  SportsActivityType,
  WantChildrenType
} from '../models/enums';
import { FeedbackType } from '../models/feedbackType';
import { MessageType } from '../models/messageType';


@Injectable({
  providedIn: 'root'
})
export class EnumMappingService {

  NotChosenText: string;
  OtherText: string;
  YesText: string;
  NoText: string;

  // GenderTypes
  FemaleText: string;
  MaleText: string;

  // ClotheStyleTypes
  CasualText: string;
  DressyText: string;
  DandyText: string;
  StylishText: string;
  FormalText: string;

  // BodyTypes
  AtlethicText: string;
  ChubbyText: string;
  NormalText: string;
  RobustText: string;
  SlimText: string;

  // BodyArtTypes
  PiercingText: string;
  TatooText: string;

  // EatingHabitsTypes
  HealthyText: string;
  GastronomicText: string;
  KosherText: string;
  OrganicText: string;
  TraditionalText: string;
  VegetarianText: string;

  // EducationStatusTypes
  GraduatedText: string;
  StudentText: string;

  // EducationTypes
  SchoolText: string;
  HighschoolText: string;
  UniversityText: string;

  // EmploymentStatusTypes
  UnemployedText: string;
  EmployedText: string;
  SelfEmployedText: string;

  // LivesInTypes
  CityText: string;
  SuburbText: string;
  CountrysideText: string;

  // SmokingHabitsTypes
  NonSmokerText: string;
  OccasionalSmokerText: string;
  SmokerText: string;

  // SportsActivityTypes
  RegularlyText: string;
  SomeRegularityText: string;
  SeldomText: string;
  NeverText: string;

  // FeedbackTypes
  CommentText: string;
  ErrorText: string;
  ImprovementText: string;
  ReportProfileText: string;

  // MessageTypes
  PrivateText: string;
  GroupText: string;

  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.selectTranslate('Enum.NotChosen').subscribe(value => this.NotChosenText = value);
    this.translocoService.selectTranslate('Enum.Other').subscribe(value => this.OtherText = value);
    this.translocoService.selectTranslate('Enum.Yes').subscribe(value => this.YesText = value);
    this.translocoService.selectTranslate('Enum.No').subscribe(value => this.NoText = value);
    // GenderType
    this.translocoService.selectTranslate('GenderTypes.Female').subscribe(value => this.FemaleText = value);
    this.translocoService.selectTranslate('GenderTypes.Male').subscribe(value => this.MaleText = value);
    // ClotheStyleType
    this.translocoService.selectTranslate('ClotheStyleTypes.Casual').subscribe(value => this.CasualText = value);
    this.translocoService.selectTranslate('ClotheStyleTypes.Dressy').subscribe(value => this.DressyText = value);
    this.translocoService.selectTranslate('ClotheStyleTypes.Dandy').subscribe(value => this.DandyText = value);
    this.translocoService.selectTranslate('ClotheStyleTypes.Stylish').subscribe(value => this.StylishText = value);
    this.translocoService.selectTranslate('ClotheStyleTypes.Formal').subscribe(value => this.FormalText = value);
    // BodyType
    this.translocoService.selectTranslate('BodyTypes.Atlethic').subscribe(value => this.AtlethicText = value);
    this.translocoService.selectTranslate('BodyTypes.Chubby').subscribe(value => this.ChubbyText = value);
    this.translocoService.selectTranslate('BodyTypes.Normal').subscribe(value => this.NormalText = value);
    this.translocoService.selectTranslate('BodyTypes.Robust').subscribe(value => this.RobustText = value);
    this.translocoService.selectTranslate('BodyTypes.Slim').subscribe(value => this.SlimText = value);
    // BodyArtType
    this.translocoService.selectTranslate('BodyArtTypes.Piercing').subscribe(value => this.PiercingText = value);
    this.translocoService.selectTranslate('BodyArtTypes.Tatoo').subscribe(value => this.TatooText = value);
    // EatingHabitsType
    this.translocoService.selectTranslate('EatingHabitsTypes.Healthy').subscribe(value => this.HealthyText = value);
    this.translocoService.selectTranslate('EatingHabitsTypes.Gastronomic').subscribe(value => this.GastronomicText = value);
    this.translocoService.selectTranslate('EatingHabitsTypes.Kosher').subscribe(value => this.KosherText = value);
    this.translocoService.selectTranslate('EatingHabitsTypes.Organic').subscribe(value => this.OrganicText = value);
    this.translocoService.selectTranslate('EatingHabitsTypes.Traditional').subscribe(value => this.TraditionalText = value);
    this.translocoService.selectTranslate('EatingHabitsTypes.Vegetarian').subscribe(value => this.VegetarianText = value);
    // EducationStatusType
    this.translocoService.selectTranslate('EducationStatusTypes.Graduated').subscribe(value => this.GraduatedText = value);
    this.translocoService.selectTranslate('EducationStatusTypes.Student').subscribe(value => this.StudentText = value);
    // EducationType
    this.translocoService.selectTranslate('EducationTypes.School').subscribe(value => this.SchoolText = value);
    this.translocoService.selectTranslate('EducationTypes.Highschool').subscribe(value => this.HighschoolText = value);
    this.translocoService.selectTranslate('EducationTypes.University').subscribe(value => this.UniversityText = value);
    // EmploymentStatusType
    this.translocoService.selectTranslate('EmploymentStatusTypes.Unemployed').subscribe(value => this.UnemployedText = value);
    this.translocoService.selectTranslate('EmploymentStatusTypes.Employed').subscribe(value => this.EmployedText = value);
    this.translocoService.selectTranslate('EmploymentStatusTypes.SelfEmployed').subscribe(value => this.SelfEmployedText = value);
    // LivesInType
    this.translocoService.selectTranslate('LivesInTypes.City').subscribe(value => this.CityText = value);
    this.translocoService.selectTranslate('LivesInTypes.Suburb').subscribe(value => this.SuburbText = value);
    this.translocoService.selectTranslate('LivesInTypes.Countryside').subscribe(value => this.CountrysideText = value);
    // SmokingHabitsType
    this.translocoService.selectTranslate('SmokingHabitsTypes.NonSmoker').subscribe(value => this.NonSmokerText = value);
    this.translocoService.selectTranslate('SmokingHabitsTypes.OccasionalSmoker').subscribe(value => this.OccasionalSmokerText = value);
    this.translocoService.selectTranslate('SmokingHabitsTypes.Smoker').subscribe(value => this.SmokerText = value);
    // SportsActivityType
    this.translocoService.selectTranslate('SportsActivityTypes.Regularly').subscribe(value => this.RegularlyText = value);
    this.translocoService.selectTranslate('SportsActivityTypes.SomeRegularity').subscribe(value => this.SomeRegularityText = value);
    this.translocoService.selectTranslate('SportsActivityTypes.Seldom').subscribe(value => this.SeldomText = value);
    this.translocoService.selectTranslate('SportsActivityTypes.Never').subscribe(value => this.NeverText = value);
    // FeedbackType
    this.translocoService.selectTranslate('FeedbackTypes.Comment').subscribe(value => this.CommentText = value);
    this.translocoService.selectTranslate('FeedbackTypes.Error').subscribe(value => this.ErrorText = value);
    this.translocoService.selectTranslate('FeedbackTypes.Improvement').subscribe(value => this.ImprovementText = value);
    this.translocoService.selectTranslate('FeedbackTypes.ReportProfile').subscribe(value => this.ReportProfileText = value);
    // MessageType
    this.translocoService.selectTranslate('MessageTypes.PrivateMessage').subscribe(value => this.PrivateText = value);
    this.translocoService.selectTranslate('MessageTypes.Group').subscribe(value => this.GroupText = value);
  }

  // GenderType
  get genderTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [GenderType.Female, this.FemaleText],
      [GenderType.Male, this.MaleText]
    ]);
  }

  private genderTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.genderTypesMap);
  genderTypeSubject = this.genderTypes.asObservable();

  async updateGenderTypeSubject(): Promise<void> {
    this.genderTypes.next(this.genderTypesMap);
  }

  // ClotheStyleType
  get clotheStyleTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [ClotheStyleType.Casual, this.CasualText],
      [ClotheStyleType.Dressy, this.DressyText],
      [ClotheStyleType.Dandy, this.DandyText],
      [ClotheStyleType.Stylish, this.StylishText],
      [ClotheStyleType.Formal, this.FormalText],
      [ClotheStyleType.Other, this.OtherText]
    ]);
  }

  private clotheStyleTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.clotheStyleTypesMap);
  clotheStyleTypeSubject = this.clotheStyleTypes.asObservable();

  async updateClotheStyleTypeSubject(): Promise<void> {
    this.clotheStyleTypes.next(this.clotheStyleTypesMap);
  }

  // BodyType
  get bodyTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [BodyType.Atlethic, this.AtlethicText],
      [BodyType.Chubby, this.ChubbyText],
      [BodyType.Normal, this.NormalText],
      [BodyType.Robust, this.RobustText],
      [BodyType.Slim, this.SlimText],
      [BodyType.Other, this.OtherText]
    ]);
  }

  private bodyTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.bodyTypesMap);
  bodyTypeSubject = this.bodyTypes.asObservable();

  async updateBodyTypeSubject(): Promise<void> {
    this.bodyTypes.next(this.bodyTypesMap);
  }

  // BodyArtType
  get bodyArtTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [BodyArtType.Piercing, this.PiercingText],
      [BodyArtType.Tatoo, this.TatooText],
      [BodyArtType.Other, this.OtherText]
    ]);
  }

  private bodyArtTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.bodyArtTypesMap);
  bodyArtTypeSubject = this.bodyArtTypes.asObservable();

  async updateBodyArtTypeSubject(): Promise<void> {
    this.bodyArtTypes.next(this.bodyArtTypesMap);
  }

  // EatingHabitsType
  get eatingHabitsTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [EatingHabitsType.Healthy, this.HealthyText],
      [EatingHabitsType.Gastronomic, this.GastronomicText],
      [EatingHabitsType.Kosher, this.KosherText],
      [EatingHabitsType.Organic, this.OrganicText],
      [EatingHabitsType.Traditional, this.TraditionalText],
      [EatingHabitsType.Vegetarian, this.VegetarianText],
      [EatingHabitsType.Other, this.OtherText]
    ]);
  }

  private eatingHabitsType = new BehaviorSubject<ReadonlyMap<string, string>>(this.eatingHabitsTypesMap);
  eatingHabitsTypeSubject = this.eatingHabitsType.asObservable();

  async updateEatingHabitsTypeSubject(): Promise<void> {
    this.eatingHabitsType.next(this.eatingHabitsTypesMap);
  }

  // EducationStatusType
  get educationStatusTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [EducationStatusType.Graduated, this.GraduatedText],
      [EducationStatusType.Student, this.StudentText],
      [EducationStatusType.Other, this.OtherText]
    ]);
  }

  private educationStatusTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.educationStatusTypesMap);
  educationStatusTypeSubject = this.educationStatusTypes.asObservable();

  async updateEducationStatusTypeSubject(): Promise<void> {
    this.educationStatusTypes.next(this.educationStatusTypesMap);
  }

  // EducationType
  get educationTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [EducationType.School, this.SchoolText],
      [EducationType.Highschool, this.HighschoolText],
      [EducationType.University, this.UniversityText],
      [EducationType.Other, this.OtherText]
    ]);
  }

  private educationTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.educationTypesMap);
  educationTypeSubject = this.educationTypes.asObservable();

  async updateEducationTypeSubject(): Promise<void> {
    this.educationTypes.next(this.educationTypesMap);
  }

  // EmploymentStatusType
  get employmentStatusTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [EmploymentStatusType.Unemployed, this.UnemployedText],
      [EmploymentStatusType.Employed, this.EmployedText],
      [EmploymentStatusType.SelfEmployed, this.SelfEmployedText],
      [EmploymentStatusType.Other, this.OtherText]
    ]);
  }

  private employmentStatusTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.employmentStatusTypesMap);
  employmentStatusTypesSubject = this.employmentStatusTypes.asObservable();

  async updateEmploymentStatusTypeSubject(): Promise<void> {
    this.employmentStatusTypes.next(this.employmentStatusTypesMap);
  }

  // HasChildrenType
  get hasChildrenTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [HasChildrenType.Yes, this.YesText],
      [HasChildrenType.No, this.NoText],
      [HasChildrenType.Other, this.OtherText]
    ]);
  }

  private hasChildrenTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.hasChildrenTypesMap);
  hasChildrenTypesSubject = this.hasChildrenTypes.asObservable();

  async updateHasChildrenTypeSubject(): Promise<void> {
    this.hasChildrenTypes.next(this.hasChildrenTypesMap);
  }

  // WantChildrenType
  get wantChildrenTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [WantChildrenType.Yes, this.YesText],
      [WantChildrenType.No, this.NoText],
      [WantChildrenType.Other, this.OtherText]
    ]);
  }

  private wantChildrenTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.wantChildrenTypesMap);
  wantChildrenTypesSubject = this.wantChildrenTypes.asObservable();

  async updateWantChildrenTypeSubject(): Promise<void> {
    this.wantChildrenTypes.next(this.wantChildrenTypesMap);
  }

  // HasPetsType
  get hasPetsTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [HasPetsType.Yes, this.YesText],
      [HasPetsType.No, this.NoText],
      [HasPetsType.Other, this.OtherText]
    ]);
  }

  private hasPetsTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.hasPetsTypesMap);
  hasPetsTypeSubject = this.hasPetsTypes.asObservable();

  async updateHasPetsTypeSubject(): Promise<void> {
    this.hasPetsTypes.next(this.hasPetsTypesMap);
  }

  // LivesInType
  get livesInTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [LivesInType.City, this.CityText],
      [LivesInType.Suburb, this.SuburbText],
      [LivesInType.Countryside, this.CountrysideText],
      [LivesInType.Other, this.OtherText]
    ]);
  }

  private livesInTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.livesInTypesMap);
  livesInTypeSubject = this.livesInTypes.asObservable();

  async updateLivesInTypeSubject(): Promise<void> {
    this.livesInTypes.next(this.livesInTypesMap);
  }

  // SmokingHabitsType
  get smokingHabitsTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [SmokingHabitsType.NonSmoker, this.NonSmokerText],
      [SmokingHabitsType.OccasionalSmoker, this.OccasionalSmokerText],
      [SmokingHabitsType.Smoker, this.SmokerText],
      [SmokingHabitsType.Other, this.OtherText]
    ]);
  }

  private smokingHabitsTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.smokingHabitsTypesMap);
  smokingHabitsTypeSubject = this.smokingHabitsTypes.asObservable();

  async updateSmokingHabitsTypeSubject(): Promise<void> {
    this.smokingHabitsTypes.next(this.smokingHabitsTypesMap);
  }

  // SportsActivityType
  get sportsActivityTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [SportsActivityType.Regularly, this.RegularlyText],
      [SportsActivityType.SomeRegularity, this.SomeRegularityText],
      [SportsActivityType.Seldom, this.SeldomText],
      [SportsActivityType.Never, this.NeverText],
      [SportsActivityType.Other, this.OtherText]
    ]);
  }

  private sportsActivityTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.sportsActivityTypesMap);
  sportsActivityTypeSubject = this.sportsActivityTypes.asObservable();

  async updateSportsActivityTypeSubject(): Promise<void> {
    this.sportsActivityTypes.next(this.sportsActivityTypesMap);
  }


  // FeedbackType
  get feedbackTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [FeedbackType.NotChosen, this.NotChosenText],
      [FeedbackType.Comment, this.CommentText],
      [FeedbackType.Error, this.ErrorText],
      [FeedbackType.Improvement, this.ImprovementText],
      [FeedbackType.ReportProfile, this.ReportProfileText]
    ]);
  }

  private feedbackTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.feedbackTypesMap);
  feedbackTypeSubject = this.feedbackTypes.asObservable();

  async updateFeedbackTypeSubject(): Promise<void> {
    this.feedbackTypes.next(this.feedbackTypesMap);
  }



  // MessageType
  get messageTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [MessageType.NotChosen, this.NotChosenText],
      [MessageType.PrivateMessage, this.PrivateText],
      [MessageType.Group, this.GroupText]
    ]);
  }

  private messageTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.messageTypesMap);
  messageTypesSubject = this.messageTypes.asObservable();

  async updateMessageTypeSubject(): Promise<void> {
    this.messageTypes.next(this.messageTypesMap);
  }
}
