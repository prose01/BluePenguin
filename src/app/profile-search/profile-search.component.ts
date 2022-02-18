import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
//import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { TranslocoService } from '@ngneat/transloco';

import { EnumMappingService } from '../services/enumMapping.service';
import { ProfileService } from '../services/profile.service';
import { BehaviorSubjectService } from '../services/behaviorSubjec.service';
import { ProfileFilter } from '../models/profileFilter';
import { CurrentUser } from '../models/currentUser';
import { Profile } from '../models/profile';
import { ViewFilterTypeEnum } from '../models/viewFilterTypeEnum';
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
import { ConfigurationLoader } from '../configuration/configuration-loader.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss']
})

//@AutoUnsubscribe()
export class ProfileSearchComponent implements OnInit {
  isTileView = true;
  matButtonToggleText: string = 'ListView';
  matButtonToggleIcon: string = 'line_style';
  loading: boolean = false;

  filter: ProfileFilter = new ProfileFilter();
  searchResultProfiles: Profile[];
  viewFilterType: ViewFilterTypeEnum = ViewFilterTypeEnum.FilterProfiles;
  profileForm: FormGroup;
  ageList: number[];
  heightList: number[] = [...Array(1 + 250 - 0).keys()].map(v => 0 + v);
  bodyTypes : ReadonlyMap<string, string>;
  smokingHabitsTypes : ReadonlyMap<string, string>;
  hasChildrenTypes : ReadonlyMap<string, string>;
  wantChildrenTypes : ReadonlyMap<string, string>;
  hasPetsTypes : ReadonlyMap<string, string>;
  livesInTypes : ReadonlyMap<string, string>;
  educationTypes : ReadonlyMap<string, string>;
  educationStatusTypes : ReadonlyMap<string, string>;
  employmentStatusTypes : ReadonlyMap<string, string>;
  sportsActivityTypes : ReadonlyMap<string, string>;
  eatingHabitsTypes : ReadonlyMap<string, string>;
  clotheStyleTypes : ReadonlyMap<string, string>;
  bodyArtTypes : ReadonlyMap<string, string>;

  genderTypes: string[] = []; // TODO: Maybe not used
  sexualOrientationTypes: string[] = []; // TODO: Maybe not used
  currentUserSubject: CurrentUser;
  currentProfileFilterSubject: ProfileFilter;
  showGenderChoise: boolean;
  tagsPlaceholder: string;
  defaultAge: number;
  maxTags: number;

  displayedColumns: string[] = ['select', 'name', 'lastActive', 'age'];   // Add columns after search or just default?

  //@Output() getProfileByFilter = EventEmitter<any> = new EventEmitter();
  @Output() getProfileByFilter: EventEmitter<any> = new EventEmitter();
  @Output() toggleDisplay: EventEmitter<any> = new EventEmitter();


  constructor(private enumMappings: EnumMappingService, private profileService: ProfileService, private behaviorSubjectService: BehaviorSubjectService, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.genderTypes.push(...this.configurationLoader.getConfiguration().genderTypes); // TODO: Maybe not used
    this.sexualOrientationTypes.push(...this.configurationLoader.getConfiguration().sexualOrientationTypes); // TODO: Maybe not used
    this.defaultAge = this.configurationLoader.getConfiguration().defaultAge;
    this.maxTags = this.configurationLoader.getConfiguration().maxTags;
    this.ageList = [...Array(1 + 120 - this.defaultAge).keys()].map(v => this.defaultAge + v);
    this.createForm();
  }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: null,
      age: null,
      height: null,
      description: null,
      tags: null,
      gender: this.genderTypes[0],
      body: BodyType.NotChosen,
      smokingHabits: SmokingHabitsType.NotChosen,
      hasChildren: HasChildrenType.NotChosen,
      wantChildren: WantChildrenType.NotChosen,
      hasPets: HasPetsType.NotChosen,
      livesIn: LivesInType.NotChosen,
      education: EducationType.NotChosen,
      educationStatus: EducationStatusType.NotChosen,
      employmentStatus: EmploymentStatusType.NotChosen,
      sportsActivity: SportsActivityType.NotChosen,
      eatingHabits: EatingHabitsType.NotChosen,
      clotheStyle: ClotheStyleType.NotChosen,
      bodyArt: BodyArtType.NotChosen
    });
  }

  ngOnInit() {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; this.setShowGenderChoise(currentUserSubject.sexualOrientation) });

    // Get and load previous ProfileFilter.
    this.behaviorSubjectService.currentProfileFilterSubject.subscribe(currentProfileFilterSubject => {
      if (currentProfileFilterSubject) {
        this.loadForm(currentProfileFilterSubject);
        this.profileForm.markAsDirty();
      }
    });

    this.translocoService.selectTranslate('ProfileSearchComponent.Tags').subscribe(value => this.tagsPlaceholder = value);

    this.enumMappings.clotheStyleTypeSubject.subscribe(value => this.clotheStyleTypes = value);
    this.enumMappings.updateClotheStyleTypeSubject();
    this.enumMappings.bodyTypeSubject.subscribe(value => this.bodyTypes = value);
    this.enumMappings.updateBodyTypeSubject();
    this.enumMappings.bodyArtTypeSubject.subscribe(value => this.bodyArtTypes = value);
    this.enumMappings.updateBodyArtTypeSubject();
    this.enumMappings.eatingHabitsTypeSubject.subscribe(value => this.eatingHabitsTypes = value);
    this.enumMappings.updateEatingHabitsTypeSubject();
    this.enumMappings.educationStatusTypeSubject.subscribe(value => this.educationStatusTypes = value);
    this.enumMappings.updateEducationStatusTypeSubject();
    this.enumMappings.educationTypeSubject.subscribe(value => this.educationTypes = value);
    this.enumMappings.updateEducationTypeSubject();
    this.enumMappings.employmentStatusTypesSubject.subscribe(value => this.employmentStatusTypes = value);
    this.enumMappings.updateEmploymentStatusTypeSubject();
    this.enumMappings.hasChildrenTypesSubject.subscribe(value => this.hasChildrenTypes = value);
    this.enumMappings.updateHasChildrenTypeSubject();
    this.enumMappings.wantChildrenTypesSubject.subscribe(value => this.wantChildrenTypes = value);
    this.enumMappings.updateWantChildrenTypeSubject();
    this.enumMappings.hasPetsTypeSubject.subscribe(value => this.hasPetsTypes = value);
    this.enumMappings.updateHasPetsTypeSubject();
    this.enumMappings.livesInTypeSubject.subscribe(value => this.livesInTypes = value);
    this.enumMappings.updateLivesInTypeSubject();
    this.enumMappings.smokingHabitsTypeSubject.subscribe(value => this.smokingHabitsTypes = value);
    this.enumMappings.updateSmokingHabitsTypeSubject();
    this.enumMappings.sportsActivityTypeSubject.subscribe(value => this.sportsActivityTypes = value);
    this.enumMappings.updateSportsActivityTypeSubject();
  }

  setShowGenderChoise(sexualOrientationType: string) {
    this.showGenderChoise = (sexualOrientationType == 'Heterosexual' || sexualOrientationType == 'Homosexual') ? false : true;
  }

  loadForm(filter: ProfileFilter) {
    this.profileForm.reset({
      name: filter.name,
      age: filter.age == null ? this.defaultAge : filter.age[1],   
      height: filter.height == null ? 0 : filter.height[1], 
      description: filter.description,
      tags: filter.tags,
      gender: filter.gender,
      body: filter.body,
      smokingHabits: filter.smokingHabits,
      hasChildren: filter.hasChildren,
      wantChildren: filter.wantChildren,
      hasPets: filter.hasPets,
      livesIn: filter.livesIn,
      education: filter.education,
      educationStatus: filter.educationStatus,
      employmentStatus: filter.employmentStatus,
      sportsActivity: filter.sportsActivity,
      eatingHabits: filter.eatingHabits,
      clotheStyle: filter.clotheStyle,
      bodyArt: filter.bodyArt
    });

    this.tagsList.push.apply(this.tagsList, filter.tags);
  }

  onSubmit() {
    this.filter = this.prepareSearch();
    
    // Just return if no search input.
    if (this.filter.name == null &&
      this.filter.age[1] == 0 &&
      this.filter.height[1] == 0 &&
      this.filter.description == null &&
      this.filter.tags.length == 0 &&
      this.filter.body == BodyType.NotChosen &&
      this.filter.smokingHabits == SmokingHabitsType.NotChosen &&
      this.filter.hasChildren == HasChildrenType.NotChosen &&
      this.filter.wantChildren == WantChildrenType.NotChosen &&
      this.filter.hasPets == HasPetsType.NotChosen &&
      this.filter.livesIn == LivesInType.NotChosen &&
      this.filter.education == EducationType.NotChosen &&
      this.filter.educationStatus == EducationStatusType.NotChosen &&
      this.filter.employmentStatus == EmploymentStatusType.NotChosen &&
      this.filter.sportsActivity == SportsActivityType.NotChosen &&
      this.filter.eatingHabits == EatingHabitsType.NotChosen &&
      this.filter.clotheStyle == ClotheStyleType.NotChosen &&
      this.filter.bodyArt == BodyArtType.NotChosen) {

      this.toggleDisplay.emit()
      return;
    }
    this.behaviorSubjectService.updateCurrentProfileFilterSubject(this.filter);
    this.getProfileByFilter.emit();
  }

  reset() {
    this.tagsList.length = 0;
    this.createForm();
    this.searchResultProfiles = [];
  }

  prepareSearch(): ProfileFilter {
    const formModel = this.profileForm.value;

    const ageRange: number[] = [this.defaultAge, Number(formModel.age)];    // TODO: Remove these ranges when slider can take two values!
    const heightRange: number[] = [0, Number(formModel.height)];

    const filterProfile: ProfileFilter = {
      name: formModel.name as string,
      age: ageRange,
      height: heightRange,
      description: formModel.description as string,
      tags: this.tagsList as string[],
      gender: formModel.gender as string,
      body: formModel.body as BodyType,
      smokingHabits: formModel.smokingHabits as SmokingHabitsType,
      hasChildren: formModel.hasChildren as HasChildrenType,
      wantChildren: formModel.wantChildren as WantChildrenType,
      hasPets: formModel.hasPets as HasPetsType,
      livesIn: formModel.livesIn as LivesInType,
      education: formModel.education as EducationType,
      educationStatus: formModel.educationStatus as EducationStatusType,
      employmentStatus: formModel.employmentStatus as EmploymentStatusType,
      sportsActivity: formModel.sportsActivity as SportsActivityType,
      eatingHabits: formModel.eatingHabits as EatingHabitsType,
      clotheStyle: formModel.clotheStyle as ClotheStyleType,
      bodyArt: formModel.bodyArt as BodyArtType
    };

    return filterProfile;
  }

  saveSearch() {
    this.loading = true;

    this.filter = this.prepareSearch();
    this.profileService.saveProfileFilter(this.filter)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        () => { },        // TODO: Give feeback on succes
        () => { this.loading = false; },
        () => { this.loading = false; }
      );
  }

  loadSearch() {
    this.loading = true;

    this.profileService.loadProfileFilter()
      //.pipe(takeWhileAlive(this))
      .subscribe(
        filter => { this.loadForm(filter); },
        () => { this.loading = false; },
        () => { this.loading = false; }
      );

    this.profileForm.markAsDirty();
  }


  // Tag section //
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, SPACE];
  tagsList: string[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.tagsList.length >= this.maxTags) {
      this.profileForm.controls.tags.setErrors({ 'incorrect': true });

      this.translocoService.selectTranslate('ProfileSearchComponent.MaxTags', { maxTags: this.maxTags }).subscribe(value => this.tagsPlaceholder = value);
      //this.tagsPlaceholder = "Max " + this.maxTags + " tags.";
      return;
    }   

    // Add our tag
    if ((value || '').trim()) {

      if (value.trim().length >= 20) {
        this.profileForm.controls.tags.setErrors({ 'incorrect': true });

        this.translocoService.selectTranslate('ProfileSearchComponent.MaxTagsCharacters').subscribe(value => this.tagsPlaceholder = value);
        //this.tagsPlaceholder = "Max 20 characters long.";
        return;
      }

      this.tagsList.push(value.trim());
      this.profileForm.markAsDirty();
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(tag: string): void {
    const index = this.tagsList.indexOf(tag);

    if (index >= 0) {
      this.tagsList.splice(index, 1);
      this.profileForm.markAsDirty();
    }
  }

  // Preserve original EnumMapping order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
}
