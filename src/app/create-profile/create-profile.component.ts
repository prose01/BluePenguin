
import { Component, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CurrentUser, GenderType, BodyType } from '../models/currentUser';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})

export class CreateProfileComponent implements OnChanges {
  currentUser: CurrentUser;
  profileForm: FormGroup;

  constructor(
    private profileService: ProfileService,
    private fb: FormBuilder) { this.createForm(); }

  createForm() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      description: '',
      genderType: '',
      body: '',
      email: ''
    });
  }

  ngOnChanges() {
    this.rebuildForm();
  }

  rebuildForm() {
    this.profileForm.reset();
  }

  onSubmit() {
    this.currentUser = this.prepareSaveProfile();
    this.profileService.addProfile(this.currentUser).subscribe(/* add error handling */);
    //this.rebuildForm(); // Hvad skal vi gøre når der er postet?
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
      age: formModel.age,
      height: formModel.height,
      weight: formModel.weight,
      description: formModel.description as string,
      gender: formModel.gender as GenderType,
      body: formModel.body as BodyType,
    };

    return saveProfile;
  }

  revert() { this.rebuildForm(); }

  ngOnInit(): void {
  }
}
