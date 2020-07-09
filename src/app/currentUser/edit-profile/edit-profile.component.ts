import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

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
  LocationType,
  EducationType,
  EducationStatusType,
  EducationLevelType,
  EmploymentStatusType,
  SportsActivityType,
  EatingHabitsType,
  ClotheStyleType,
  BodyArtType
} from '../../models/enums';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent {
  currentUserSubject: CurrentUser;
  profileForm: FormGroup;
  genderTypes = Object.keys(GenderType);
  sexualOrientationTypes = Object.keys(SexualOrientationType);
  bodyTypes = Object.keys(BodyType);
  smokingHabitsTypes = Object.keys(SmokingHabitsType);
  locationTypes = Object.keys(LocationType);
  educationTypes = Object.keys(EducationType);
  educationStatusTypes = Object.keys(EducationStatusType);
  educationLevelTypes = Object.keys(EducationLevelType);
  employmentStatusTypes = Object.keys(EmploymentStatusType);
  sportsActivityTypes = Object.keys(SportsActivityType);
  eatingHabitsTypes = Object.keys(EatingHabitsType);
  clotheStyleTypes = Object.keys(ClotheStyleType);
  bodyArtTypes = Object.keys(BodyArtType);

  constructor(public auth: AuthService, private profileService: ProfileService, private formBuilder: FormBuilder, private dialog: MatDialog) { this.createForm(); }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: null,
      createdOn: null,
      updatedOn: null,
      lastActive: null,
      age: null,
      height: null,
      weight: null,
      description: null,
      genderType: null,
      sexualOrientationType: null,
      bodyType: null,
      smokingHabitsType: null,
      hasChildrenType: null,
      wantChildrenType: null,
      hasPetsType: null,
      locationType: null,
      educationType: null,
      educationStatusType: null,
      educationLevelType: null,
      employmentStatusType: null,
      sportsActivityType: null,
      eatingHabitsType: null,
      clotheStyleType: null,
      bodyArtType: null
    });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; this.prefilForm(); });
        }
      });
    }
  }

  prefilForm() {
    this.profileForm.patchValue({
      name: this.currentUserSubject.name as string,
      createdOn: this.currentUserSubject.createdOn,
      updatedOn: this.currentUserSubject.updatedOn,
      lastActive: this.currentUserSubject.lastActive,
      age: this.currentUserSubject.age as number,
      height: this.currentUserSubject.height as number,
      weight: this.currentUserSubject.weight as number,
      description: this.currentUserSubject.description as string,
      gender: this.currentUserSubject.gender as GenderType,
      sexualOrientationType: this.currentUserSubject.sexualOrientation as SexualOrientationType,
      bodyType: this.currentUserSubject.body as BodyType,
      smokingHabitsType: this.currentUserSubject.smokingHabits as SmokingHabitsType,
      hasChildrenType: this.currentUserSubject.hasChildren as HasChildrenType,
      wantChildrenType: this.currentUserSubject.wantChildren as WantChildrenType,
      hasPetsType: this.currentUserSubject.hasPets as HasPetsType,
      locationType: this.currentUserSubject.livesIn as LocationType,
      educationType: this.currentUserSubject.education as EducationType,
      educationStatusType: this.currentUserSubject.educationStatus as EducationStatusType,
      educationLevelType: this.currentUserSubject.educationLevel as EducationLevelType,
      employmentStatusType: this.currentUserSubject.employmentStatus as EmploymentStatusType,
      sportsActivityType: this.currentUserSubject.sportsActivity as SportsActivityType,
      eatingHabitsType: this.currentUserSubject.eatingHabits as EatingHabitsType,
      clotheStyleType: this.currentUserSubject.clotheStyle as ClotheStyleType,
      bodyArtType: this.currentUserSubject.bodyArt as BodyArtType
    });
  }

  revert() { this.prefilForm(); }

  onSubmit() {
    this.currentUserSubject = this.prepareSaveProfile();
    this.profileService.putProfile(this.currentUserSubject).subscribe(/* add error handling */);
    this.prefilForm(); // Hvad skal vi gøre når der er postet?
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
      weight: formModel.weight as number,
      description: formModel.description as string,
      images: this.currentUserSubject.images,
      gender: formModel.gender as GenderType,
      sexualOrientation: formModel.sexualOrientation as SexualOrientationType,
      body: formModel.body as BodyType,
      smokingHabits: formModel.smokingHabits as SmokingHabitsType,
      hasChildren: formModel.hasChildren as HasChildrenType,
      wantChildren: formModel.wantChildren as WantChildrenType,
      hasPets: formModel.hasPets as HasPetsType,
      livesIn: formModel.livesIn as LocationType,
      education: formModel.education as EducationType,
      educationStatus: formModel.educationStatus as EducationStatusType,
      educationLevel: formModel.educationLevel as EducationLevelType,
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

}
