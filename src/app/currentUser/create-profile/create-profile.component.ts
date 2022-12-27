import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { getBrowserLang } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { ErrorDialog } from '../../error-dialog/error-dialog.component';
import { EnumMappingService } from '../../services/enumMapping.service';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
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
  BodyArtType
} from '../../models/enums';
import { KeyValue } from '@angular/common';
import { CreateProfileDialog } from '../create-profile-dialog/create-profile-dialog.component';

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html'
})

export class CreateProfileComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private currentUser: CurrentUser;
  private newUserForm: FormGroup;
  private genderTypes: ReadonlyMap<string, string>;
  private bodyTypes: ReadonlyMap<string, string>;
  private smokingHabitsTypes: ReadonlyMap<string, string>;
  private hasChildrenTypes: ReadonlyMap<string, string>;
  private wantChildrenTypes: ReadonlyMap<string, string>;
  private hasPetsTypes: ReadonlyMap<string, string>;
  private livesInTypes: ReadonlyMap<string, string>;
  private educationTypes: ReadonlyMap<string, string>;
  private educationStatusTypes: ReadonlyMap<string, string>;
  private employmentStatusTypes: ReadonlyMap<string, string>;
  private sportsActivityTypes: ReadonlyMap<string, string>;
  private eatingHabitsTypes: ReadonlyMap<string, string>;
  private clotheStyleTypes: ReadonlyMap<string, string>;
  private bodyArtTypes: ReadonlyMap<string, string>;

  private namePlaceholder: string;
  private genderPlaceholder: string;
  private minAge: number;
  private maxAge: number;
  private minHeight: number;
  private maxHeight: number;
  private tagsPlaceholder: string;
  private maxTags: number;

  private isChecked: boolean = true;

  private siteLocale: string;
  private languageList: string[] = [];
  private countryList: string[] = [];
  private countrycodePlaceholder: string;

  @Output("isCurrentUserCreated") isCurrentUserCreated: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private enumMappings: EnumMappingService, private profileService: ProfileService, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader, private dialog: MatDialog, private readonly translocoService: TranslocoService) {
    this.minAge = this.configurationLoader.getConfiguration().minAge;
    this.maxAge = this.configurationLoader.getConfiguration().maxAge;
    this.minHeight = this.configurationLoader.getConfiguration().minHeight;
    this.maxHeight = this.configurationLoader.getConfiguration().maxHeight;
    this.maxTags = this.configurationLoader.getConfiguration().maxTags;
    this.languageList = this.configurationLoader.getConfiguration().languageList;
    this.countryList = this.configurationLoader.getConfiguration().countryList;
    this.createForm();
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.currentUser = new CurrentUser;
    }

    this.subs.push(
      this.translocoService.selectTranslate('Name').subscribe(value => this.namePlaceholder = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('Tags').subscribe(value => this.tagsPlaceholder = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('Country').subscribe(value => this.countrycodePlaceholder = value)
    );

    this.subs.push(
      this.enumMappings.genderTypeSubject.subscribe(value => this.genderTypes = value)
    );
    this.enumMappings.updateGenderTypeSubject();

    this.subs.push(
      this.enumMappings.clotheStyleTypeSubject.subscribe(value => this.clotheStyleTypes = value)
    );
    this.enumMappings.updateClotheStyleTypeSubject();

    this.subs.push(
      this.enumMappings.bodyTypeSubject.subscribe(value => this.bodyTypes = value)
    );
    this.enumMappings.updateBodyTypeSubject();

    this.subs.push(
      this.enumMappings.bodyArtTypeSubject.subscribe(value => this.bodyArtTypes = value)
    );
    this.enumMappings.updateBodyArtTypeSubject();

    this.subs.push(
      this.enumMappings.eatingHabitsTypeSubject.subscribe(value => this.eatingHabitsTypes = value)
    );
    this.enumMappings.updateEatingHabitsTypeSubject();

    this.subs.push(
      this.enumMappings.educationStatusTypeSubject.subscribe(value => this.educationStatusTypes = value)
    );
    this.enumMappings.updateEducationStatusTypeSubject();

    this.subs.push(
      this.enumMappings.educationTypeSubject.subscribe(value => this.educationTypes = value)
    );
    this.enumMappings.updateEducationTypeSubject();

    this.subs.push(
      this.enumMappings.employmentStatusTypesSubject.subscribe(value => this.employmentStatusTypes = value)
    );
    this.enumMappings.updateEmploymentStatusTypeSubject();

    this.subs.push(
      this.enumMappings.hasChildrenTypesSubject.subscribe(value => this.hasChildrenTypes = value)
    );
    this.enumMappings.updateHasChildrenTypeSubject();

    this.subs.push(
      this.enumMappings.wantChildrenTypesSubject.subscribe(value => this.wantChildrenTypes = value)
    );
    this.enumMappings.updateWantChildrenTypeSubject();

    this.subs.push(
      this.enumMappings.hasPetsTypeSubject.subscribe(value => this.hasPetsTypes = value)
    );
    this.enumMappings.updateHasPetsTypeSubject();

    this.subs.push(
      this.enumMappings.livesInTypeSubject.subscribe(value => this.livesInTypes = value)
    );
    this.enumMappings.updateLivesInTypeSubject();

    this.subs.push(
      this.enumMappings.smokingHabitsTypeSubject.subscribe(value => this.smokingHabitsTypes = value)
    );
    this.enumMappings.updateSmokingHabitsTypeSubject();

    this.subs.push(
      this.enumMappings.sportsActivityTypeSubject.subscribe(value => this.sportsActivityTypes = value)
    );
    this.enumMappings.updateSportsActivityTypeSubject();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private createForm(): void {
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
      seeking: [null, [Validators.required]],
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

  private revert(): void {
    this.tagsList.length = 0;
    this.createForm();
    this.namePlaceholder = this.translocoService.translate('Name');
    this.genderPlaceholder = this.translocoService.translate('Gender');

    this.subs.push(
      this.translocoService.selectTranslate('Tags').subscribe(value => this.tagsPlaceholder = value)
    );
    this.newUserForm.controls.tags.setErrors({ 'incorrect': false });
    this.newUserForm.markAsPristine();
  }

  private onSubmit(): void {

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

      if (this.newUserForm.controls.countrycode?.errors != null && this.newUserForm.controls.countrycode.errors.required) {
        this.countrycodePlaceholder = this.translocoService.translate('CreateProfileComponent.CountrycodeRequired');
      }

      if (this.newUserForm.controls.languagecode.errors?.required) {
        this.namePlaceholder = this.translocoService.translate('CreateProfileComponent.LanguagecodeRequired');
      }

      if (this.newUserForm.controls.countrycode.errors?.required) {
        this.namePlaceholder = this.translocoService.translate('CreateProfileComponent.CountrycodeRequired');
      }

      return;
    }
    else if (this.newUserForm.valid) {
      this.subs.push(
        this.profileService.addProfile(this.currentUser)
        .subscribe({
          next: () => {
            this.profileService.updateCurrentUserSubject();
          },
          complete: () => {
            this.openCreateProfileDialog();
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotSaveUser'), null);
          }
        })
      );
    }
  }

  private prepareSaveProfile(): CurrentUser {
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
      gender: formModel.gender as GenderType,
      seeking: formModel.seeking as string[],
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
  private visible = true;
  private selectable = true;
  private removable = true;
  private addOnBlur = true;
  private readonly separatorKeysCodes: number[] = [ENTER, SPACE];
  private tagsList: string[] = [];

  private add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if (this.tagsList.length >= this.maxTags) {
      this.newUserForm.controls.tags.setErrors({ 'incorrect': true });
      this.subs.push(
        this.translocoService.selectTranslate('MaxTags', { maxTags: this.maxTags }).subscribe(value => this.tagsPlaceholder = value)
      );

      // Reset the input value
      if (input) {
        input.value = null;
        event.chipInput.clear;
      }

      return;
    }

    // Add our tag
    if ((value || '').trim()) {

      if (value.trim().length >= 20) {
        this.newUserForm.controls.tags.setErrors({ 'incorrect': true });
        this.subs.push(
          this.translocoService.selectTranslate('MaxTagsCharacters').subscribe(value => this.tagsPlaceholder = value)
        );

        // Reset the input value
        if (input) {
          input.value = null;
          event.chipInput.clear;
        }

        return;
      }

      this.tagsList.push(value.trim());
      this.newUserForm.markAsDirty();
    }

    // Reset the input value
    if (input) {
      input.value = '';
      event.chipInput.clear;
    }
  }

  private remove(tag: string): void {
    const index = this.tagsList.indexOf(tag);

    if (index >= 0) {
      this.tagsList.splice(index, 1);
      this.newUserForm.markAsDirty();
    }
  }

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }

  // Preserve original EnumMapping order
  private originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  private switchLanguage(): void {
    this.translocoService.setActiveLang(this.siteLocale);
    // TranslocoService needs to finsh first before we can update.
    setTimeout(() => {
      this.enumMappings.updateGenderTypeSubject();
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

  private openCreateProfileDialog(): void {

    const dialogRef = this.dialog.open(CreateProfileDialog);

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res === true) {
            this.isCurrentUserCreated.emit({ isCreated: true, languagecode: this.currentUser.languagecode, uploadImageClick: true });
          }
          else {
            this.isCurrentUserCreated.emit({ isCreated: true, languagecode: this.currentUser.languagecode, uploadImageClick: false });
          }
        }
      )
    );
  }
}
