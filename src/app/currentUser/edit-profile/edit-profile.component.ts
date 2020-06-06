import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { GenderType, SexualOrientationType, BodyType } from '../../models/enums';
import { DeleteProfileDialog } from '../delete-profile/delete-profile-dialog.component';

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
      sexualOrientation: this.currentUserSubject.sexualOrientation as SexualOrientationType,
      body: this.currentUserSubject.body as BodyType,
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
      auth0Id: this.currentUserSubject.auth0Id, 
      profileId: this.currentUserSubject.profileId,
      admin: this.currentUserSubject.admin,
      name: formModel.name as string,
      createdOn: this.currentUserSubject.createdOn,
      updatedOn: this.currentUserSubject.updatedOn,
      lastActive: this.currentUserSubject.lastActive,
      age: formModel.age as number,
      height: formModel.height as number,
      weight: formModel.weight as number,
      description: formModel.description as string,
      gender: formModel.gender as GenderType,
      sexualOrientation: formModel.sexualOrientation as SexualOrientationType,
      body: formModel.body as BodyType,
      images: this.currentUserSubject.images,
      chatMemberslist: this.currentUserSubject.chatMemberslist
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
