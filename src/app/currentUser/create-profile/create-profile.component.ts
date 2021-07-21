import { Component, EventEmitter, Output } from '@angular/core';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

import { ErrorDialog } from '../../error-dialog/error-dialog.component';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
import {
  GenderType,
  SexualOrientationType,
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

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.scss']
})

export class CreateProfileComponent {
  currentUser: CurrentUser;
  newUserForm: FormGroup;
  genderTypes = Object.keys(GenderType);
  sexualOrientationTypes = Object.keys(SexualOrientationType);
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

  namePlaceholder: string = "Name";
  genderPlaceholder: string = "Gender";
  sexualOrientationPlaceholder: string = "Sexual orientation";
  tagsPlaceholder: string = "Tags";
  maxTags: number;

  isChecked: boolean = true;

  @Output("isCurrentUserCreated") isCurrentUserCreated: EventEmitter<any> = new EventEmitter();
  @Output("initDefaultData") initDefaultData: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader, private dialog: MatDialog) {
    this.maxTags = this.configurationLoader.getConfiguration().maxTags;
    this.createForm();
  }

  createForm() {
    this.newUserForm = this.formBuilder.group({
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
  }

  revert() {
    this.tagsList.length = 0;
    this.createForm();
    this.namePlaceholder = "Name";
    this.genderPlaceholder = "Gender";
    this.sexualOrientationPlaceholder = "Sexual orientation";
  }

  onChange(): void {
    if (this.newUserForm.invalid) {
      this.newUserForm.setErrors({ ...this.newUserForm.errors, 'newUserForm': true });

      if (this.newUserForm.controls.name.errors != null && this.newUserForm.controls.name.errors.maxlength) {
        this.namePlaceholder = "Name cannot be more than 20 characters long.";
      }
    }
  } 

  onSubmit() {
    this.currentUser = this.prepareSaveProfile();
    if (this.newUserForm.invalid) {
      this.newUserForm.setErrors({ ...this.newUserForm.errors, 'newUserForm': true });

      if (this.newUserForm.controls.name.errors.required) {
        this.namePlaceholder = "Name is required.";
      }

      if (this.newUserForm.controls.name.errors.minlength) {
        this.namePlaceholder = "Name must be at least 3 characters long.";
      }

      if (this.newUserForm.controls.name.errors.maxlength) {
        this.namePlaceholder = "Name cannot be more than 20 characters long.";
      }

      if (this.newUserForm.controls.gender.errors != null && this.newUserForm.controls.gender.errors.required) {
        this.genderPlaceholder = "Gender is required.";
      }

      if (this.newUserForm.controls.sexualOrientation.errors != null && this.newUserForm.controls.sexualOrientation.errors.required) {
        this.sexualOrientationPlaceholder = "Sexual orientation is required.";
      }

      return;
    }
    else if (this.newUserForm.valid) {
      this.profileService.addProfile(this.currentUser).subscribe(
        () => { },
        (error: any) => {
          this.isCurrentUserCreated.emit(false);
          if (error.status === 400) {
            this.openErrorDialog("Could not save user", error);
          }
          else {
            this.openErrorDialog("Could not save user", null);
          }
        },
        () => {
          this.profileService.updateCurrentUserSubject();
          this.initDefaultData.emit();
          this.isCurrentUserCreated.emit(true);
        });
    }
  }

  prepareSaveProfile(): CurrentUser {
    const formModel = this.newUserForm.value;

    const saveProfile: CurrentUser = {
      bookmarks: null,
      chatMemberslist: null,
      auth0Id: null,
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
      sexualOrientation: formModel.sexualOrientation as SexualOrientationType,
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
      this.tagsPlaceholder = "Max " + this.maxTags + " tags.";
      return;
    }

    // Add our tag
    if ((value || '').trim()) {

      if (value.trim().length >= 20) {
        this.newUserForm.controls.tags.setErrors({ 'incorrect': true });
        this.tagsPlaceholder = "Max 20 characters long.";
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
}
