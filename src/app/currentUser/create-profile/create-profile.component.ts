import { Component, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
import {
  GenderType,
  SexualOrientationType,
  BodyType,
  SmokingHabitsType,
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
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})

export class CreateProfileComponent implements OnChanges {
  currentUser: CurrentUser;
  newUserForm: FormGroup;
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

  constructor(public auth: AuthService, private profileService: ProfileService, private formBuilder: FormBuilder) { this.createForm(); }

  createForm() {
    this.newUserForm = this.formBuilder.group({
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
      hasChildren: null,
      wantChildren: null,
      hasPets: null,
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
      this.currentUser = new CurrentUser;
    }
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  rebuildForm() {
    this.newUserForm.reset();
  }

  revert() { this.rebuildForm(); }

  onSubmit() {
    this.currentUser = this.prepareSaveProfile();
    this.profileService.addProfile(this.currentUser).subscribe(/* add error handling */);
    //this.rebuildForm(); // Hvad skal vi gøre når der er postet?
  }

  prepareSaveProfile(): CurrentUser {
    const formModel = this.newUserForm.value;

    const saveProfile: CurrentUser = {
      chatMemberslist: this.currentUser.chatMemberslist,
      auth0Id: null,
      profileId: null,
      admin: null,
      name: formModel.name as string,
      createdOn: null,
      updatedOn: null,
      lastActive: null,
      age: formModel.age,
      height: formModel.height,
      weight: formModel.weight,
      description: formModel.description as string,
      images: this.currentUser.images,
      gender: formModel.gender as GenderType,
      sexualOrientation: formModel.sexualOrientation as SexualOrientationType,
      body: formModel.body as BodyType,
      smokingHabits: formModel.smokingHabits as SmokingHabitsType,
      hasChildren: formModel.hasChildren as boolean,
      wantChildren: formModel.wantChildren as boolean,
      hasPets: formModel.hasPets as boolean,
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
}
