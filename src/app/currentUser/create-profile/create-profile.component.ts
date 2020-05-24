import { Component, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
import { GenderType, BodyType } from '../../models/enums';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})

export class CreateProfileComponent implements OnChanges {
  currentUser: CurrentUser;
  newUserForm: FormGroup;
  genderTypes = Object.keys(GenderType);
  bodyTypes = Object.keys(BodyType);

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
      bodyType: null
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
      gender: formModel.gender as GenderType,
      body: formModel.body as BodyType,
      images: this.currentUser.images,
      chatMemberslist: this.currentUser.chatMemberslist
    };

    return saveProfile;
  }
}
