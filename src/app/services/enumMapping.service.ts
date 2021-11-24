import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import {
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
import { FeedbackEnum } from '../models/feedbackEnum';


@Injectable()
export class EnumMappingService {

  NotChosenText: string;
  OtherText: string;
  YesText: string;
  NoText: string;

  // ClotheStyleType
  CasualText: string;
  DressyText: string;
  DandyText: string;
  StylishText: string;
  FormalText: string;

  // BodyType
  AtlethicText: string;
  ChubbyText: string;
  NormalText: string;
  RobustText: string;
  SlimText: string;

  // BodyArtType
  PiercingText: string;
  TatooText: string;

  // EatingHabitsType
  HealthyText: string;
  GastronomicText: string;
  KosherText: string;
  OrganicText: string;
  TraditionalText: string;
  VegetarianText: string;

  // EducationStatusType
  GraduatedText: string;
  StudentText: string;

  // EducationType
  SchoolText: string;
  HighschoolText: string;
  UniversityText: string;

  // EmploymentStatusType
  UnemployedText: string;
  EmployedText: string;
  SelfEmployedText: string;

  // LivesInType
  CityText: string;
  SuburbText: string;
  CountrysideText: string;

  // SmokingHabitsType
  NonSmokerText: string;
  OccasionalSmokerText: string;
  SmokerText: string;

  // SportsActivityType
  RegularlyText: string;
  SomeRegularityText: string;
  SeldomText: string;
  NeverText: string;

  // FeedbackType
  CommentText: string;
  ErrorText: string;
  ImprovementText: string;
  ReportProfileText: string;

  constructor(private readonly translocoService: TranslocoService) {
    this.translocoService.selectTranslate('Enum.NotChosen').subscribe(value => this.NotChosenText = value);
    this.translocoService.selectTranslate('Enum.Other').subscribe(value => this.OtherText = value);
    this.translocoService.selectTranslate('Enum.Yes').subscribe(value => this.YesText = value);
    this.translocoService.selectTranslate('Enum.No').subscribe(value => this.NoText = value);
    // ClotheStyleType
    this.translocoService.selectTranslate('ClotheStyleType.Casual').subscribe(value => this.CasualText = value);
    this.translocoService.selectTranslate('ClotheStyleType.Dressy').subscribe(value => this.DressyText = value);
    this.translocoService.selectTranslate('ClotheStyleType.Dandy').subscribe(value => this.DandyText = value);
    this.translocoService.selectTranslate('ClotheStyleType.Stylish').subscribe(value => this.StylishText = value);
    this.translocoService.selectTranslate('ClotheStyleType.Formal').subscribe(value => this.FormalText = value);
    // BodyType
    this.translocoService.selectTranslate('BodyType.Atlethic').subscribe(value => this.AtlethicText = value);
    this.translocoService.selectTranslate('BodyType.Chubby').subscribe(value => this.ChubbyText = value);
    this.translocoService.selectTranslate('BodyType.Normal').subscribe(value => this.NormalText = value);
    this.translocoService.selectTranslate('BodyType.Robust').subscribe(value => this.RobustText = value);
    this.translocoService.selectTranslate('BodyType.Slim').subscribe(value => this.SlimText = value);
    // BodyArtType
    this.translocoService.selectTranslate('BodyArtType.Piercing').subscribe(value => this.PiercingText = value);
    this.translocoService.selectTranslate('BodyArtType.Tatoo').subscribe(value => this.TatooText = value);
    // EatingHabitsType
    this.translocoService.selectTranslate('EatingHabitsType.Healthy').subscribe(value => this.HealthyText = value);
    this.translocoService.selectTranslate('EatingHabitsType.Gastronomic').subscribe(value => this.GastronomicText = value);
    this.translocoService.selectTranslate('EatingHabitsType.Kosher').subscribe(value => this.KosherText = value);
    this.translocoService.selectTranslate('EatingHabitsType.Organic').subscribe(value => this.OrganicText = value);
    this.translocoService.selectTranslate('EatingHabitsType.Traditional').subscribe(value => this.TraditionalText = value);
    this.translocoService.selectTranslate('EatingHabitsType.Vegetarian').subscribe(value => this.VegetarianText = value);
    // EducationStatusType
    this.translocoService.selectTranslate('EducationStatusType.Graduated').subscribe(value => this.GraduatedText = value);
    this.translocoService.selectTranslate('EducationStatusType.Student').subscribe(value => this.StudentText = value);
    // EducationType
    this.translocoService.selectTranslate('EducationType.School').subscribe(value => this.SchoolText = value);
    this.translocoService.selectTranslate('EducationType.Highschool').subscribe(value => this.HighschoolText = value);
    this.translocoService.selectTranslate('EducationType.University').subscribe(value => this.UniversityText = value);
    // EmploymentStatusType
    this.translocoService.selectTranslate('EmploymentStatusType.Unemployed').subscribe(value => this.UnemployedText = value);
    this.translocoService.selectTranslate('EmploymentStatusType.Employed').subscribe(value => this.EmployedText = value);
    this.translocoService.selectTranslate('EmploymentStatusType.SelfEmployed').subscribe(value => this.SelfEmployedText = value);
    // LivesInType
    this.translocoService.selectTranslate('LivesInType.City').subscribe(value => this.CityText = value);
    this.translocoService.selectTranslate('LivesInType.Suburb').subscribe(value => this.SuburbText = value);
    this.translocoService.selectTranslate('LivesInType.Countryside').subscribe(value => this.CountrysideText = value);
    // SmokingHabitsType
    this.translocoService.selectTranslate('SmokingHabitsType.NonSmoker').subscribe(value => this.NonSmokerText = value);
    this.translocoService.selectTranslate('SmokingHabitsType.OccasionalSmoker').subscribe(value => this.OccasionalSmokerText = value);
    this.translocoService.selectTranslate('SmokingHabitsType.Smoker').subscribe(value => this.SmokerText = value);
    // SportsActivityType
    this.translocoService.selectTranslate('SportsActivityType.Regularly').subscribe(value => this.RegularlyText = value);
    this.translocoService.selectTranslate('SportsActivityType.SomeRegularity').subscribe(value => this.SomeRegularityText = value);
    this.translocoService.selectTranslate('SportsActivityType.Seldom').subscribe(value => this.SeldomText = value);
    this.translocoService.selectTranslate('SportsActivityType.Never').subscribe(value => this.NeverText = value);
    // FeedbackType
    this.translocoService.selectTranslate('FeedbackType.Comment').subscribe(value => this.CommentText = value);
    this.translocoService.selectTranslate('FeedbackType.Error').subscribe(value => this.ErrorText = value);
    this.translocoService.selectTranslate('FeedbackType.Improvement').subscribe(value => this.ImprovementText = value);
    this.translocoService.selectTranslate('FeedbackType.ReportProfile').subscribe(value => this.ReportProfileText = value);
  }

  // ClotheStyleType
  get clotheStyleTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [ClotheStyleType.NotChosen, this.NotChosenText],
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

  async updateClotheStyleTypeSubject() {
    this.clotheStyleTypes.next(this.clotheStyleTypesMap);
  }

  // BodyType
  get bodyTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [BodyType.NotChosen, this.NotChosenText],
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

  async updateBodyTypeSubject() {
    this.bodyTypes.next(this.bodyTypesMap);
  }

  // BodyArtType
  get bodyArtTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [BodyArtType.NotChosen, this.NotChosenText],
      [BodyArtType.Piercing, this.PiercingText],
      [BodyArtType.Tatoo, this.TatooText],
      [BodyArtType.Other, this.OtherText]
    ]);
  }

  private bodyArtTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.bodyArtTypesMap);
  bodyArtTypeSubject = this.bodyArtTypes.asObservable();

  async updateBodyArtTypeSubject() {
    this.bodyArtTypes.next(this.bodyArtTypesMap);
  }

  // EatingHabitsType
  get eatingHabitsTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [EatingHabitsType.NotChosen, this.NotChosenText],
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

  async updateEatingHabitsTypeSubject() {
    this.eatingHabitsType.next(this.eatingHabitsTypesMap);
  }

  // EducationStatusType
  get educationStatusTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [EducationStatusType.NotChosen, this.NotChosenText],
      [EducationStatusType.Graduated, this.GraduatedText],
      [EducationStatusType.Student, this.StudentText],
      [EducationStatusType.Other, this.OtherText]
    ]);
  }

  private educationStatusTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.educationStatusTypesMap);
  educationStatusTypeSubject = this.educationStatusTypes.asObservable();

  async updateEducationStatusTypeSubject() {
    this.educationStatusTypes.next(this.educationStatusTypesMap);
  }

  // EducationType
  get educationTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [EducationType.NotChosen, this.NotChosenText],
      [EducationType.School, this.SchoolText],
      [EducationType.Highschool, this.HighschoolText],
      [EducationType.University, this.UniversityText],
      [EducationType.Other, this.OtherText]
    ]);
  }

  private educationTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.educationTypesMap);
  educationTypeSubject = this.educationTypes.asObservable();

  async updateEducationTypeSubject() {
    this.educationTypes.next(this.educationTypesMap);
  }

  // EmploymentStatusType
  get employmentStatusTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [EmploymentStatusType.NotChosen, this.NotChosenText],
      [EmploymentStatusType.Unemployed, this.UnemployedText],
      [EmploymentStatusType.Employed, this.EmployedText],
      [EmploymentStatusType.SelfEmployed, this.SelfEmployedText],
      [EmploymentStatusType.Other, this.OtherText]
    ]);
  }

  private employmentStatusTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.employmentStatusTypesMap);
  employmentStatusTypesSubject = this.employmentStatusTypes.asObservable();

  async updateEmploymentStatusTypeSubject() {
    this.employmentStatusTypes.next(this.employmentStatusTypesMap);
  }

  // HasChildrenType
  get hasChildrenTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [HasChildrenType.NotChosen, this.NotChosenText],
      [HasChildrenType.Yes, this.YesText],
      [HasChildrenType.No, this.NoText],
      [HasChildrenType.Other, this.OtherText]
    ]);
  }

  private hasChildrenTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.hasChildrenTypesMap);
  hasChildrenTypesSubject = this.hasChildrenTypes.asObservable();

  async updateHasChildrenTypeSubject() {
    this.hasChildrenTypes.next(this.hasChildrenTypesMap);
  }

  // WantChildrenType
  get wantChildrenTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [WantChildrenType.NotChosen, this.NotChosenText],
      [WantChildrenType.Yes, this.YesText],
      [WantChildrenType.No, this.NoText],
      [WantChildrenType.Other, this.OtherText]
    ]);
  }

  private wantChildrenTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.wantChildrenTypesMap);
  wantChildrenTypesSubject = this.wantChildrenTypes.asObservable();

  async updateWantChildrenTypeSubject() {
    this.wantChildrenTypes.next(this.wantChildrenTypesMap);
  }

  // HasPetsType
  get hasPetsTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [HasPetsType.NotChosen, this.NotChosenText],
      [HasPetsType.Yes, this.YesText],
      [HasPetsType.No, this.NoText],
      [HasPetsType.Other, this.OtherText]
    ]);
  }

  private hasPetsTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.hasPetsTypesMap);
  hasPetsTypeSubject = this.hasPetsTypes.asObservable();

  async updateHasPetsTypeSubject() {
    this.hasPetsTypes.next(this.hasPetsTypesMap);
  }

  // LivesInType
  get livesInTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [LivesInType.NotChosen, this.NotChosenText],
      [LivesInType.City, this.CityText],
      [LivesInType.Suburb, this.SuburbText],
      [LivesInType.Countryside, this.CountrysideText],
      [LivesInType.Other, this.OtherText]
    ]);
  }

  private livesInTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.livesInTypesMap);
  livesInTypeSubject = this.livesInTypes.asObservable();

  async updateLivesInTypeSubject() {
    this.livesInTypes.next(this.livesInTypesMap);
  }

  // SmokingHabitsType
  get smokingHabitsTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [SmokingHabitsType.NotChosen, this.NotChosenText],
      [SmokingHabitsType.NonSmoker, this.NonSmokerText],
      [SmokingHabitsType.OccasionalSmoker, this.OccasionalSmokerText],
      [SmokingHabitsType.Smoker, this.SmokerText],
      [SmokingHabitsType.Other, this.OtherText]
    ]);
  }

  private smokingHabitsTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.smokingHabitsTypesMap);
  smokingHabitsTypeSubject = this.smokingHabitsTypes.asObservable();

  async updateSmokingHabitsTypeSubject() {
    this.smokingHabitsTypes.next(this.smokingHabitsTypesMap);
  }

  // SportsActivityType
  get sportsActivityTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [SportsActivityType.NotChosen, this.NotChosenText],
      [SportsActivityType.Regularly, this.RegularlyText],
      [SportsActivityType.SomeRegularity, this.SomeRegularityText],
      [SportsActivityType.Seldom, this.SeldomText],
      [SportsActivityType.Never, this.NeverText],
      [SportsActivityType.Other, this.OtherText]
    ]);
  }

  private sportsActivityTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.sportsActivityTypesMap);
  sportsActivityTypeSubject = this.sportsActivityTypes.asObservable();

  async updateSportsActivityTypeSubject() {
    this.sportsActivityTypes.next(this.sportsActivityTypesMap);
  }


  // FeedbackType
  get feedbackTypesMap(): ReadonlyMap<string, string> {
    return new Map<string, string>([
      [FeedbackEnum.Comment, this.CommentText],
      [FeedbackEnum.Error, this.ErrorText],
      [FeedbackEnum.Improvement, this.ImprovementText],
      [FeedbackEnum.ReportProfile, this.ReportProfileText]
    ]);
  }

  private feedbackTypes = new BehaviorSubject<ReadonlyMap<string, string>>(this.feedbackTypesMap);
  feedbackTypeSubject = this.feedbackTypes.asObservable();

  async updateFeedbackTypeSubject() {
    this.feedbackTypes.next(this.feedbackTypesMap);
  }
}
