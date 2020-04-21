import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { GenderType, BodyType } from '../../models/enums';
import { DeleteProfileDialog } from '../delete-profile/delete-profile-dialog.component';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent {
  currentUser: CurrentUser;
  profileForm: FormGroup;
  genderTypes = Object.keys(GenderType);
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
      bodyType: null
    });
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) { this.getCurrentUserProfile(); }
      });
    }
  }

  getCurrentUserProfile(): void {
    this.profileService.getCurrentUserProfile().subscribe(
      res => {
        this.currentUser = res;
        this.prefilForm();
      }
    );
  }

  prefilForm() {
    this.profileForm.patchValue({
      name: this.currentUser.name as string,
      createdOn: this.currentUser.createdOn,
      updatedOn: this.currentUser.updatedOn,
      lastActive: this.currentUser.lastActive,
      age: this.currentUser.age as number,
      height: this.currentUser.height as number,
      weight: this.currentUser.weight as number,
      description: this.currentUser.description as string,
      gender: this.currentUser.gender as GenderType,
      body: this.currentUser.body as BodyType,
    });
  }

  revert() { this.prefilForm(); }

  onSubmit() {
    this.currentUser = this.prepareSaveProfile();
    this.profileService.putProfile(this.currentUser).subscribe(/* add error handling */);
    this.prefilForm(); // Hvad skal vi gøre når der er postet?
  }

  prepareSaveProfile(): CurrentUser {
    const formModel = this.profileForm.value;

    const saveProfile: CurrentUser = {
      auth0Id: this.currentUser.auth0Id, 
      profileId: this.currentUser.profileId,
      admin: this.currentUser.admin,
      name: formModel.name as string,
      createdOn: this.currentUser.createdOn,
      updatedOn: this.currentUser.updatedOn,
      lastActive: this.currentUser.lastActive,
      age: formModel.age as number,
      height: formModel.height as number,
      weight: formModel.weight as number,
      description: formModel.description as string,
      gender: formModel.gender as GenderType,
      body: formModel.body as BodyType,
      images: this.currentUser.images
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
