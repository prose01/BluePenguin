import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { CurrentUser, GenderType, BodyType } from '../models/currentUser';
import { ProfileService } from '../services/profile.service';

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

  constructor(
    private profileService: ProfileService, private formBuilder: FormBuilder) { this.createForm(); }

  createForm() {
    this.profileForm = this.formBuilder.group({
      email: null,
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
    this.getCurrentUserProfile();
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
      email: this.currentUser.email,
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

  //rebuildForm() {
  //		this.profileForm.reset({
  //      email: this.profile.email,
  //      name: this.profile.name as string,
  //      createdOn: this.profile.createdOn,
  //      updatedOn: this.profile.updatedOn,
  //      lastActive: this.profile.lastActive,
  //      age: this.profile.age as number,
  //      height: this.profile.height as number,
  //      weight: this.profile.weight as number,
  //      description: this.profile.description as string,
  //      genderType: this.profile.gender as GenderType,
  //      bodyType: this.profile.body as BodyType,
  //   });
  //}

  revert() { this.prefilForm(); }

  onSubmit() {
    this.currentUser = this.prepareSaveProfile();
    this.profileService.putProfile(this.currentUser).subscribe(/* add error handling */);
    this.prefilForm(); // Hvad skal vi gøre når der er postet?
  }

  prepareSaveProfile(): CurrentUser {
    const formModel = this.profileForm.value;

    const saveProfile: CurrentUser = {
      profileId: this.currentUser.profileId,
      email: this.currentUser.email,
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
    };

    return saveProfile;
  }

}
