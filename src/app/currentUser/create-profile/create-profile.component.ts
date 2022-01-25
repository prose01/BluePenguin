import { Component, EventEmitter, Output } from '@angular/core';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { getBrowserLang } from '@ngneat/transloco';

import { ErrorDialog } from '../../error-dialog/error-dialog.component';
import { EnumMappingService } from '../../services/enumMapping.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../authorisation/auth/auth.service';
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
  BodyArtType
} from '../../models/enums';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})

export class CreateProfileComponent {
  currentUser: CurrentUser;
  newUserForm: FormGroup;
  bodyTypes: ReadonlyMap<string, string>;
  smokingHabitsTypes: ReadonlyMap<string, string>;
  hasChildrenTypes: ReadonlyMap<string, string>;
  wantChildrenTypes: ReadonlyMap<string, string>;
  hasPetsTypes: ReadonlyMap<string, string>;
  livesInTypes: ReadonlyMap<string, string>;
  educationTypes: ReadonlyMap<string, string>;
  educationStatusTypes: ReadonlyMap<string, string>;
  employmentStatusTypes: ReadonlyMap<string, string>;
  sportsActivityTypes: ReadonlyMap<string, string>;
  eatingHabitsTypes: ReadonlyMap<string, string>;
  clotheStyleTypes: ReadonlyMap<string, string>;
  bodyArtTypes: ReadonlyMap<string, string>;

  namePlaceholder: string;
  genderPlaceholder: string;
  genderTypes: string[] = [];
  sexualOrientationTypes: string[] = [];
  defaultAge: number;
  sexualOrientationPlaceholder: string;
  tagsPlaceholder: string;
  maxTags: number;

  isChecked: boolean = true;

  siteLocale: string;
  languageList: string[] = [];
  countryList: string[] = [];
  countrycodePlaceholder: string;

  @Output("isCurrentUserCreated") isCurrentUserCreated: EventEmitter<any> = new EventEmitter();
  @Output("initDefaultData") initDefaultData: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private enumMappings: EnumMappingService, private profileService: ProfileService, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader, private dialog: MatDialog, private readonly translocoService: TranslocoService) {
    this.genderTypes.push(...this.configurationLoader.getConfiguration().genderTypes);
    this.sexualOrientationTypes.push(...this.configurationLoader.getConfiguration().sexualOrientationTypes);
    this.defaultAge = this.configurationLoader.getConfiguration().defaultAge;
    this.maxTags = this.configurationLoader.getConfiguration().maxTags;
    this.languageList = this.configurationLoader.getConfiguration().languageList;
    this.countryList = this.configurationLoader.getConfiguration().countryList;
    this.createForm();
  }

  createForm() {
    this.newUserForm = this.formBuilder.group({
      languagecode: getBrowserLang() || 'en',
      countrycode: null,
      name: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      createdOn: null,
      updatedOn: null,
      lastActive: null,
      age: null,
      height: null,
      contactable: true,
      description: null,
      tags: null,
      gender: [null, [Validators.required]],
      sexualOrientation: [null, [Validators.required]],
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

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.currentUser = new CurrentUser;
    }

    this.translocoService.selectTranslate('CreateProfileComponent.Name').subscribe(value => this.namePlaceholder = value);
    this.translocoService.selectTranslate('CreateProfileComponent.Gender').subscribe(value => this.genderPlaceholder = value);
    this.translocoService.selectTranslate('CreateProfileComponent.SexualOrientationType').subscribe(value => this.sexualOrientationPlaceholder = value);
    this.translocoService.selectTranslate('CreateProfileComponent.Tags').subscribe(value => this.tagsPlaceholder = value);
    this.translocoService.selectTranslate('CreateProfileComponent.Country').subscribe(value => this.countrycodePlaceholder = value);

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

  revert() {
    this.tagsList.length = 0;
    this.createForm();
    this.namePlaceholder = this.translocoService.translate('CreateProfileComponent.Name');
    this.genderPlaceholder = this.translocoService.translate('CreateProfileComponent.Gender');
    this.sexualOrientationPlaceholder = this.translocoService.translate('CreateProfileComponent.SexualOrientationType');
  }

  //onChange(): void {
  //  if (this.newUserForm.invalid) {
  //    this.newUserForm.setErrors({ ...this.newUserForm.errors, 'newUserForm': true });

  //    if (this.newUserForm.controls.name.errors != null && this.newUserForm.controls.name.errors.maxlength) {
  //      this.namePlaceholder = this.translocoService.translate('CreateProfileComponent.NameMaxCharacters');
  //    }
  //  }
  //} 

  onSubmit() {
    this.currentUser = this.prepareSaveProfile();
    if (this.newUserForm.invalid) {
      this.newUserForm.setErrors({ ...this.newUserForm.errors, 'newUserForm': true });

      if (this.newUserForm.controls.name.errors?.required) {
        this.namePlaceholder = this.translocoService.translate('CreateProfileComponent.NameRequired');
      }

      if (this.newUserForm.controls.name.errors?.minlength) {
        this.namePlaceholder = this.translocoService.translate('CreateProfileComponent.NameMinCharacters');
      }

      if (this.newUserForm.controls.name.errors?.maxlength) {
        this.namePlaceholder = this.translocoService.translate('CreateProfileComponent.NameMaxCharacters');
      }

      if (this.newUserForm.controls.gender?.errors != null && this.newUserForm.controls.gender.errors.required) {
        this.genderPlaceholder = this.translocoService.translate('CreateProfileComponent.GenderRequired');
      }

      if (this.newUserForm.controls.sexualOrientation?.errors != null && this.newUserForm.controls.sexualOrientation.errors.required) {
        this.sexualOrientationPlaceholder = this.translocoService.translate('CreateProfileComponent.SexualRequired');
      }

      if (this.newUserForm.controls.countrycode?.errors != null && this.newUserForm.controls.countrycode.errors.required) {
        this.countrycodePlaceholder = this.translocoService.translate('CreateProfileComponent.CountrycodeRequired');
      }

      return;
    }
    else if (this.newUserForm.valid) {
      this.profileService.addProfile(this.currentUser).subscribe(
        () => { },
        (error: any) => {
          this.isCurrentUserCreated.emit({ isCreated: false, languagecode: this.currentUser.languagecode });
          if (error.status === 400) {
            this.openErrorDialog(this.translocoService.translate('CreateProfileComponent.CouldNotSaveUser'), error);
          }
          else {
            this.openErrorDialog(this.translocoService.translate('CreateProfileComponent.CouldNotSaveUser'), null);
          }
        },
        () => {
          this.profileService.updateCurrentUserSubject();
          this.initDefaultData.emit(); // TODO: Move to Photo tab after Create
          this.isCurrentUserCreated.emit({ isCreated: true, languagecode: this.currentUser.languagecode });
        });
    }
  }

  prepareSaveProfile(): CurrentUser {
    const formModel = this.newUserForm.value;

    const saveProfile: CurrentUser = {
      languagecode: formModel.languagecode as string,
      countrycode: formModel.countrycode as string,
      bookmarks: null,
      chatMemberslist: null,
      profileId: null,
      admin: false,
      images: null,
      createdOn: new Date(),
      updatedOn: new Date(),
      lastActive: new Date(),
      name: formModel.name as string,
      age: formModel.age as number,
      height: formModel.height as number,
      contactable: formModel.contactable as boolean,
      description: formModel.description as string,
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
      visited: null,
      likes: null
    };

    return saveProfile;
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
      this.newUserForm.controls.tags.setErrors({ 'incorrect': true });
      this.translocoService.selectTranslate('CreateProfileComponent.MaxTags', { maxTags: this.maxTags }).subscribe(value => this.tagsPlaceholder = value);
      return;
    }

    // Add our tag
    if ((value || '').trim()) {

      if (value.trim().length >= 20) {
        this.newUserForm.controls.tags.setErrors({ 'incorrect': true });
        this.translocoService.selectTranslate('CreateProfileComponent.MaxTagsCharacters').subscribe(value => this.tagsPlaceholder = value);
        return;
      }

      this.tagsList.push(value.trim());
      this.newUserForm.markAsDirty();
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
      this.newUserForm.markAsDirty();
    }
  }

  openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
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
}
