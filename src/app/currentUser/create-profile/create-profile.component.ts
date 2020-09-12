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
  HasChildrenType,
  WantChildrenType,
  HasPetsType,
  LivesInType,
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
  hasChildrenTypes = Object.keys(HasChildrenType);
  wantChildrenTypes = Object.keys(WantChildrenType);
  hasPetsTypes = Object.keys(HasPetsType);
  livesInTypes = Object.keys(LivesInType);
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
      hasChildrenType: null,
      wantChildrenType: null,
      hasPetsType: null,
      livesInType: null,
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
      auth0Id: this.currentUser.auth0Id,
      profileId: this.currentUser.profileId,
      admin: this.currentUser.admin,
      images: this.currentUser.images,
      createdOn: this.currentUser.createdOn,
      updatedOn: this.currentUser.updatedOn,
      lastActive: this.currentUser.lastActive,
      name: formModel.name as string,
      age: formModel.age as number,
      height: formModel.height as number,
      weight: formModel.weight as number,
      description: formModel.description as string,
      gender: formModel.genderType as GenderType,
      sexualOrientation: formModel.sexualOrientationType as SexualOrientationType,
      body: formModel.bodyType as BodyType,
      smokingHabits: formModel.smokingHabitsType as SmokingHabitsType,
      hasChildren: formModel.hasChildrenType as HasChildrenType,
      wantChildren: formModel.wantChildrenType as WantChildrenType,
      hasPets: formModel.hasPetsType as HasPetsType,
      livesIn: formModel.livesInType as LivesInType,
      education: formModel.educationType as EducationType,
      educationStatus: formModel.educationStatusType as EducationStatusType,
      educationLevel: formModel.educationLevelType as EducationLevelType,
      employmentStatus: formModel.employmentStatusType as EmploymentStatusType,
      sportsActivity: formModel.sportsActivityType as SportsActivityType,
      eatingHabits: formModel.eatingHabitsType as EatingHabitsType,
      clotheStyle: formModel.clotheStyleType as ClotheStyleType,
      bodyArt: formModel.bodyArtType as BodyArtType
    };

    return saveProfile;
  }
}
