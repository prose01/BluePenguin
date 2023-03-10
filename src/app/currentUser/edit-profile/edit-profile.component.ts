import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { KeyValue } from '@angular/common';

import { ErrorDialog } from '../../error-dialog/error-dialog.component';
import { ProfileService } from '../../services/profile.service';
import { EnumMappingService } from '../../services/enumMapping.service';
import { DeleteProfileDialog } from '../delete-profile/delete-profile-dialog.component';
import { ColourPickerComponent } from '../../colour-picker/colour-picker.component';
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
  BodyArtType,
} from '../../models/enums';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})

export class EditProfileComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private profileForm: FormGroup;

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

  private isChecked: boolean;
  private minAge: number;
  private maxAge: number;
  private minHeight: number;
  private maxHeight: number;

  private tagsPlaceholder: string;
  private maxTags: number;

  private siteLocale: string;
  private languageList: string[] = [];
  private countryList: string[] = [];

  private warningText: string;
  private countryResetText: string;

  public currentUserSubject: CurrentUser;
  private avatarInitialsColour: string;
  private avatarColour: string;
  public loading: boolean = false;

  constructor(private enumMappings: EnumMappingService, private profileService: ProfileService, private formBuilder: FormBuilder, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService, private translocoLocale: TranslocoLocaleService) {
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
    this.subs.push(
      this.profileService.currentUserSubject.pipe(first()).subscribe(currentUserSubject => {
        this.currentUserSubject = currentUserSubject;
        this.avatarInitialsColour = this.currentUserSubject.avatar.initialsColour;
        this.avatarColour = this.currentUserSubject.avatar.circleColour;
        this.prefilForm();
      })
    );
    this.subs.push(
      this.translocoService.selectTranslate('Tags').subscribe(value => this.tagsPlaceholder = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('EditProfileComponent.Warning').subscribe(value => this.warningText = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('EditProfileComponent.CountryReset').subscribe(value => this.countryResetText = value)
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
      seeking: null,
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
      bodyArt: null,
      avatarInitials: null,
      avatarColour: null
    });
  }

  private prefilForm(): void {
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
      gender: this.currentUserSubject.gender as GenderType,
      seeking: this.currentUserSubject.seeking as string[],
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
      bodyArt: this.currentUserSubject.bodyArt as BodyArtType,
      avatarInitials: this.currentUserSubject.avatar.initials as string,
      avatarColour: this.currentUserSubject.avatar.circleColour as string
    });

    this.avatarInitialsColour = this.currentUserSubject.avatar.initialsColour;
    this.avatarColour = this.currentUserSubject.avatar.circleColour;
    this.isChecked = this.currentUserSubject.contactable as boolean;
    this.tagsList.push.apply(this.tagsList, this.currentUserSubject.tags);
    this.siteLocale = this.currentUserSubject.languagecode;
  }

  private revert(): void {
    this.tagsList.length = 0;

    setTimeout(() => {
      this.prefilForm();
      this.switchLanguage();
    }, 50);

    this.subs.push(
      this.translocoService.selectTranslate('Tags').subscribe(value => this.tagsPlaceholder = value)
    );
    this.profileForm.controls.tags.setErrors({ 'incorrect': false });

    this.profileForm.markAsPristine();
  }

  private onSubmit(): void {
    this.loading = true;
    this.currentUserSubject = this.prepareSaveProfile();
    this.subs.push(
      this.profileService.putProfile(this.currentUserSubject)
        .subscribe({
          next: () => { },
          complete: () => {
            this.profileForm.markAsPristine(); this.loading = false;
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotSaveUser'), null); this.loading = false;
          }
        })
    );
  }

  private prepareSaveProfile(): CurrentUser {
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
      visited: this.currentUserSubject.visited,
      likes: this.currentUserSubject.likes,
      avatar: {
        initials: formModel.avatarInitials as string,
        initialsColour: this.avatarInitialsColour as string,
        circleColour: this.avatarColour as string
      }
    };

    return saveProfile;
  }

  private openDeleteCurrentUserDialog(): void {
    var profileIds: string[] = [this.currentUserSubject.profileId];

    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      data: profileIds
    });
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
      this.profileForm.controls.tags.setErrors({ 'incorrect': true });
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
        this.profileForm.controls.tags.setErrors({ 'incorrect': true });
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
      this.profileForm.markAsDirty();
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
      this.profileForm.markAsDirty();
    }
  }

  private openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }

  private selectAvatarColours(colourType: string): void {
    const dialogRef = this.dialog.open(ColourPickerComponent, {
      data: {
        colour: colourType == 'circleColour' ? this.avatarColour : this.avatarInitialsColour
      }
    });

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res) {
            if (colourType == 'circleColour') {
              this.avatarColour = res;
            }
            else {
              this.avatarInitialsColour = res;
            }
            this.profileForm.markAsDirty();
          }
        }
      )
    );
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

  private switchCountry(): void {
    this.openErrorDialog(this.warningText, this.countryResetText);
  }
}
