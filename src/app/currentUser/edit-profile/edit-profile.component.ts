import { Component, OnInit } from '@angular/core';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { first } from 'rxjs/operators';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { KeyValue } from '@angular/common';

import { ErrorDialog } from '../../error-dialog/error-dialog.component';
import { ProfileService } from '../../services/profile.service';
import { EnumMappingService } from '../../services/enumMapping.service';
import { DeleteProfileDialog } from '../delete-profile/delete-profile-dialog.component';
import { CurrentUser } from '../../models/currentUser';
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
  BodyArtType,
} from '../../models/enums';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})

@AutoUnsubscribe()
export class EditProfileComponent implements OnInit {

  currentUserSubject: CurrentUser;
  profileForm: FormGroup;
  bodyTypes : ReadonlyMap<string, string>;
  smokingHabitsTypes : ReadonlyMap<string, string>;
  hasChildrenTypes : ReadonlyMap<string, string>;
  wantChildrenTypes : ReadonlyMap<string, string>;
  hasPetsTypes : ReadonlyMap<string, string>;
  livesInTypes : ReadonlyMap<string, string>;
  educationTypes: ReadonlyMap<string, string>;
  educationStatusTypes : ReadonlyMap<string, string>;
  employmentStatusTypes : ReadonlyMap<string, string>;
  sportsActivityTypes : ReadonlyMap<string, string>;
  eatingHabitsTypes : ReadonlyMap<string, string>;
  clotheStyleTypes : ReadonlyMap<string, string>;
  bodyArtTypes : ReadonlyMap<string, string>;

  genderTypes: string[] = [];
  sexualOrientationTypes: string[] = [];

  isChecked: boolean;
  defaultAge: number;

  tagsPlaceholder: string;
  maxTags: number;

  loading: boolean = false;

  siteLocale: string;
  languageList: string[] = [];
  countryList: string[] = [];

  warningText: string;
  countryResetText: string;

  constructor(private enumMappings: EnumMappingService, private profileService: ProfileService, private formBuilder: FormBuilder, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService, private translocoLocale: TranslocoLocaleService) {
    this.genderTypes.push(...this.configurationLoader.getConfiguration().genderTypes);
    this.sexualOrientationTypes.push(...this.configurationLoader.getConfiguration().sexualOrientationTypes);
    this.defaultAge = this.configurationLoader.getConfiguration().defaultAge;
    this.maxTags = this.configurationLoader.getConfiguration().maxTags;
    this.languageList = this.configurationLoader.getConfiguration().languageList;
    this.countryList = this.configurationLoader.getConfiguration().countryList;
    this.createForm();
  }

  ngOnInit(): void {
    this.profileService.currentUserSubject.pipe(first()).subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; this.prefilForm(); });
    this.translocoService.selectTranslate('EditProfileComponent.Tags').subscribe(value => this.tagsPlaceholder = value);
    this.translocoService.selectTranslate('EditProfileComponent.Warning').subscribe(value => this.warningText = value);
    this.translocoService.selectTranslate('EditProfileComponent.CountryReset').subscribe(value => this.countryResetText = value);
    
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

  createForm() {
    this.profileForm = this.formBuilder.group({
      languagecode: null,
      countrycode: null,
      name: null,
      createdOn: null,
      updatedOn: null,
      lastActive: null,
      age: null,
      height: null,
      contactable: true,
      description: null,
      tags: null,
      gender: null,
      sexualOrientation: null,
      body: null,
      smokingHabits: null,
      hasChildren: null,
      wantChildren: null,
      hasPets: null,
      livesIn: null,
      education: null,
      educationStatus: null,
      employmentStatus: null,
      sportsActivity: null,
      eatingHabits: null,
      clotheStyle: null,
      bodyArt: null
    });
  }

  prefilForm() {
    this.profileForm.patchValue({
      languagecode: this.currentUserSubject.languagecode as string,
      countrycode: this.currentUserSubject.countrycode as string,
      name: this.currentUserSubject.name as string,
      createdOn: this.translocoLocale.localizeDate(this.currentUserSubject.createdOn, this.currentUserSubject.languagecode, { dateStyle: 'medium', timeStyle: 'short' }), 
      updatedOn: this.translocoLocale.localizeDate(this.currentUserSubject.updatedOn, this.currentUserSubject.languagecode, { dateStyle: 'medium', timeStyle: 'short' }), 
      lastActive: this.translocoLocale.localizeDate(this.currentUserSubject.lastActive, this.currentUserSubject.languagecode, { dateStyle: 'medium', timeStyle: 'short' }), 
      age: this.currentUserSubject.age as number,
      height: this.currentUserSubject.height as number,
      contactable: this.currentUserSubject.contactable as boolean,
      description: this.currentUserSubject.description as string,
      tags: this.currentUserSubject.tags as string[],
      gender: this.currentUserSubject.gender as string,
      sexualOrientation: this.currentUserSubject.sexualOrientation as string,
      body: this.currentUserSubject.body as BodyType,
      smokingHabits: this.currentUserSubject.smokingHabits as SmokingHabitsType,
      hasChildren: this.currentUserSubject.hasChildren as HasChildrenType,
      wantChildren: this.currentUserSubject.wantChildren as WantChildrenType,
      hasPets: this.currentUserSubject.hasPets as HasPetsType,
      livesIn: this.currentUserSubject.livesIn as LivesInType,
      education: this.currentUserSubject.education as EducationType,
      educationStatus: this.currentUserSubject.educationStatus as EducationStatusType,
      employmentStatus: this.currentUserSubject.employmentStatus as EmploymentStatusType,
      sportsActivity: this.currentUserSubject.sportsActivity as SportsActivityType,
      eatingHabits: this.currentUserSubject.eatingHabits as EatingHabitsType,
      clotheStyle: this.currentUserSubject.clotheStyle as ClotheStyleType,
      bodyArt: this.currentUserSubject.bodyArt as BodyArtType
    });

    this.isChecked = this.currentUserSubject.contactable as boolean;
    this.tagsList.push.apply(this.tagsList, this.currentUserSubject.tags);
    this.siteLocale = this.currentUserSubject.languagecode;
  }

  revert() {
    this.tagsList.length = 0;

    setTimeout(() => {
      this.prefilForm();
      this.switchLanguage();
    }, 50);

    this.profileForm.markAsPristine();
  }

  onSubmit() {
    this.loading = true;
    this.currentUserSubject = this.prepareSaveProfile();
    this.profileService.putProfile(this.currentUserSubject)
      .pipe(takeWhileAlive(this))  // TODO: Not sure this is good idea with save profile?
      .subscribe(
        () => { },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('EditProfileComponent.CouldNotSaveUser'), null); this.loading = false;
        },
        () => { this.profileForm.markAsPristine(); this.loading = false; }
      );
  }

  prepareSaveProfile(): CurrentUser {
    const formModel = this.profileForm.value;

    const saveProfile: CurrentUser = {
      languagecode: formModel.languagecode as string,
      countrycode: formModel.countrycode as string,
      bookmarks: this.currentUserSubject.bookmarks,
      chatMemberslist: this.currentUserSubject.chatMemberslist,
      profileId: this.currentUserSubject.profileId,
      admin: this.currentUserSubject.admin,
      name: this.currentUserSubject.name,
      createdOn: this.currentUserSubject.createdOn,
      updatedOn: this.currentUserSubject.updatedOn,
      lastActive: this.currentUserSubject.lastActive,
      age: formModel.age as number,
      height: formModel.height as number,
      contactable: formModel.contactable as boolean,
      description: formModel.description as string,
      images: this.currentUserSubject.images,
      tags: this.tagsList as string[],
      gender: formModel.gender as string,
      sexualOrientation: formModel.sexualOrientation as string,
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
      bodyArt: formModel.bodyArt as BodyArtType,
      visited: this.currentUserSubject.visited,
      likes: this.currentUserSubject.likes
    };
    
    return saveProfile;
  }

  openDeleteCurrentUserDialog(): void {
    var profileIds: string[] = [this.currentUserSubject.profileId];

    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      data: profileIds
    });
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
      this.translocoService.selectTranslate('EditProfileComponent.MaxTags', { maxTags: this.maxTags }).subscribe(value => this.tagsPlaceholder = value);
      return;
    }   

    // Add our tag
    if ((value || '').trim()) {

      if (value.trim().length >= 20) {
        this.profileForm.controls.tags.setErrors({ 'incorrect': true });
        this.translocoService.selectTranslate('EditProfileComponent.MaxTagsCharacters').subscribe(value => this.tagsPlaceholder = value);
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

  openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }

  // Preserve original EnumMapping order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  switchLanguage() {
    this.translocoService.setActiveLang(this.siteLocale);
    // TranslocoService needs to finsh first before we can update.
    setTimeout(() => {
      this.enumMappings.updateClotheStyleTypeSubject();
      this.enumMappings.updateBodyTypeSubject();
      this.enumMappings.updateBodyArtTypeSubject();
      this.enumMappings.updateEatingHabitsTypeSubject();
      this.enumMappings.updateEducationStatusTypeSubject();
      this.enumMappings.updateEducationTypeSubject();
      this.enumMappings.updateEmploymentStatusTypeSubject();
      this.enumMappings.updateHasChildrenTypeSubject();
      this.enumMappings.updateWantChildrenTypeSubject();
      this.enumMappings.updateHasPetsTypeSubject();
      this.enumMappings.updateLivesInTypeSubject();
      this.enumMappings.updateSmokingHabitsTypeSubject();
      this.enumMappings.updateSportsActivityTypeSubject();
    }, 50);
  }

  switchCountry() {
    this.openErrorDialog(this.warningText, this.countryResetText);
  }
}
