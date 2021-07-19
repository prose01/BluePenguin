import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ProfileService } from '../services/profile.service';
import { BehaviorSubjectService } from '../services/behaviorSubjec.service';
import { ProfileFilter } from '../models/profileFilter';
import { CurrentUser } from '../models/currentUser';
import { Profile } from '../models/profile';
import { ViewFilterTypeEnum } from '../models/viewFilterTypeEnum';
import {
  GenderType,
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
  BodyArtType,
  SexualOrientationType
} from '../models/enums';
import { ConfigurationLoader } from '../configuration/configuration-loader.service';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss']
})

@AutoUnsubscribe()
export class ProfileSearchComponent implements OnInit {
  isTileView = true;
  matButtonToggleText: string = 'ListView';
  matButtonToggleIcon: string = 'line_style';
  loading: boolean = false;

  filter: ProfileFilter = new ProfileFilter();
  searchResultProfiles: Profile[];
  viewFilterType: ViewFilterTypeEnum = ViewFilterTypeEnum.FilterProfiles;
  profileForm: FormGroup;
  ageList: number[] = [...Array(1 + 120 - 16).keys()].map(v => 16 + v);
  heightList: number[] = [...Array(1 + 250 - 0).keys()].map(v => 0 + v);
  genderTypes = Object.keys(GenderType);
  bodyTypes = Object.keys(BodyType);
  smokingHabitsTypes = Object.keys(SmokingHabitsType);
  hasChildrenTypes = Object.keys(HasChildrenType);
  wantChildrenTypes = Object.keys(WantChildrenType);
  hasPetsTypes = Object.keys(HasPetsType);
  livesInTypes = Object.keys(LivesInType);
  educationTypes = Object.keys(EducationType);
  educationStatusTypes = Object.keys(EducationStatusType);
  employmentStatusTypes = Object.keys(EmploymentStatusType);
  sportsActivityTypes = Object.keys(SportsActivityType);
  eatingHabitsTypes = Object.keys(EatingHabitsType);
  clotheStyleTypes = Object.keys(ClotheStyleType);
  bodyArtTypes = Object.keys(BodyArtType);

  currentUserSubject: CurrentUser;
  currentProfileFilterSubject: ProfileFilter;
  showGenderChoise: boolean;
  tagsPlaceholder: string = "Tags";
  maxTags: number;

  displayedColumns: string[] = ['select', 'name', 'lastActive', 'age'];   // Add columns after search or just default?

  @Output() getProfileByFilter = new EventEmitter<ProfileFilter>();

  constructor(private profileService: ProfileService, private behaviorSubjectService: BehaviorSubjectService, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader) {
    this.maxTags = this.configurationLoader.getConfiguration().maxTags;
    this.createForm();
  }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: null,
      age: null,
      height: null,
      description: null,
      tags: null,
      gender: GenderType.Female,
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
  }

  setShowGenderChoise(sexualOrientationType: SexualOrientationType) {
    this.showGenderChoise = (sexualOrientationType == SexualOrientationType.Heterosexual || sexualOrientationType == SexualOrientationType.Homosexual) ? false : true;
  }

  loadForm(filter: ProfileFilter) {
    this.profileForm.reset({
      name: filter.name,
      age: filter.age[1],
      height: filter.height[1],
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
    this.behaviorSubjectService.updateCurrentProfileFilterSubject(this.filter);
    this.getProfileByFilter.emit(this.filter);
  }

  revert() {
    this.tagsList.length = 0;
    this.createForm();
    this.searchResultProfiles = [];
  }

  prepareSearch(): ProfileFilter {
    const formModel = this.profileForm.value;

    const ageRange: number[] = [16, Number(formModel.age)];    // TODO: Remove these ranges when slider can take two values!
    const heightRange: number[] = [0, Number(formModel.height)];

    const filterProfile: ProfileFilter = {
      name: formModel.name as string,
      age: ageRange,
      height: heightRange,
      description: formModel.description as string,
      tags: this.tagsList as string[],
      gender: formModel.gender as GenderType,
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
      .pipe(takeWhileAlive(this))
      .subscribe(
        () => { },        // TODO: Give feeback on succes
        () => { this.loading = false; },
        () => { this.loading = false; }
      );
  }

  loadSearch() {
    this.loading = true;

    this.profileService.loadProfileFilter()
      .pipe(takeWhileAlive(this))
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
      this.tagsPlaceholder = "Max " + this.maxTags + " tags.";
      return;
    }   

    // Add our tag
    if ((value || '').trim()) {

      if (value.trim().length >= 20) {
        this.profileForm.controls.tags.setErrors({ 'incorrect': true });
        this.tagsPlaceholder = "Max 20 characters long.";
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
}
