import { Component } from '@angular/core';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { first } from 'rxjs/operators';

import { AuthService } from '../../authorisation/auth/auth.service';
import { ProfileService } from '../../services/profile.service';
import { DeleteProfileDialog } from '../delete-profile/delete-profile-dialog.component';
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
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})

export class EditProfileComponent {
  currentUserSubject: CurrentUser;
  profileForm: FormGroup;
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

  tagsPlaceholder: string = "Tags";

  constructor(public auth: AuthService, private datePipe: DatePipe, private profileService: ProfileService, private formBuilder: FormBuilder, private dialog: MatDialog) { this.createForm(); }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: null,
      createdOn: null,
      updatedOn: null,
      lastActive: null,
      age: null,
      height: null,
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

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.profileService.currentUserSubject.pipe(first()).subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; this.prefilForm(); });
        }
      });
    }
  }

  // TODO Remove datePipe when Pipe works!
  //https://www.angularjswiki.com/angular/how-to-use-angular-pipes-in-components-and-services/

  prefilForm() {
    this.profileForm.patchValue({
      name: this.currentUserSubject.name as string,
      createdOn: this.datePipe.transform(this.currentUserSubject.createdOn, 'dd-MM-yyyy hh:mm'),
      updatedOn: this.datePipe.transform(this.currentUserSubject.updatedOn, 'dd-MM-yyyy hh:mm'),
      lastActive: this.datePipe.transform(this.currentUserSubject.lastActive, 'dd-MM-yyyy hh:mm'),
      age: this.currentUserSubject.age as number,
      height: this.currentUserSubject.height as number,
      description: this.currentUserSubject.description as string,
      tags: this.currentUserSubject.tags as string[],
      gender: this.currentUserSubject.gender as GenderType,
      sexualOrientation: this.currentUserSubject.sexualOrientation as SexualOrientationType,
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

    this.tagsList.push.apply(this.tagsList, this.currentUserSubject.tags);
  }

  revert() {
    this.tagsList.length = 0;
    this.prefilForm();
  }

  onSubmit() {
    this.currentUserSubject = this.prepareSaveProfile();
    this.profileService.putProfile(this.currentUserSubject).subscribe(/* add error handling */);
    // Hvad skal vi gøre når der er postet?
  }

  prepareSaveProfile(): CurrentUser {
    const formModel = this.profileForm.value;

    const saveProfile: CurrentUser = {
      chatMemberslist: this.currentUserSubject.chatMemberslist,
      auth0Id: this.currentUserSubject.auth0Id, 
      profileId: this.currentUserSubject.profileId,
      admin: this.currentUserSubject.admin,
      name: this.currentUserSubject.name,
      createdOn: this.currentUserSubject.createdOn,
      updatedOn: this.currentUserSubject.updatedOn,
      lastActive: this.currentUserSubject.lastActive,
      age: formModel.age as number,
      height: formModel.height as number,
      description: formModel.description as string,
      images: this.currentUserSubject.images,
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
      bodyArt: formModel.bodyArt as BodyArtType
    };

    return saveProfile;
  }

  openDeleteCurrentUserDialog(): void {
    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      height: '300px',
      width: '300px',
      data: { profileIds: [] }
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

    if (this.tagsList.length >= 10) {
      this.profileForm.controls.tags.setErrors({ 'incorrect': true });
      this.tagsPlaceholder = "Max 10 tags.";
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
