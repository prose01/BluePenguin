import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Profile, GenderType, BodyType } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent {
	profile : Profile;
  profileForm: FormGroup;
  genderTypes = Object.keys(GenderType);
  bodyTypes = Object.keys(BodyType);

  constructor(
	private profileService: ProfileService,
  private formBuilder: FormBuilder) { this.createForm(); }

  createForm() {
      this.profileForm = this.formBuilder.group({
          email: '', 
          name: '',
          createdOn: '',
          updatedOn: '',
          lastActive: '',
          age: '',
          height: '',
          weight: '',
          description: '',
          genderType: '',
          bodyType: ''
	    });
  }

  ngOnInit(): void {
      this.getCurrentUserProfile();
	}

  getCurrentUserProfile(): void {
      this.profileService.getCurrentUserProfile().subscribe(
          res => {
              this.profile = res;
              this.prefilForm();
          }
      );
  }

  prefilForm() {
      this.profileForm.patchValue({
        email: this.profile.email,
        name: this.profile.name as string,
        createdOn: this.profile.createdOn,
        updatedOn: this.profile.updatedOn,
        lastActive: this.profile.lastActive,
        age: this.profile.age as number,
        height: this.profile.height as number,
        weight: this.profile.weight as number,
        description: this.profile.description as string,
        genderType: this.profile.gender as GenderType,
        bodyType: this.profile.body as BodyType,
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
	  this.profile = this.prepareSaveProfile();
    this.profileService.putProfile(this.profile).subscribe(/* add error handling */);
	  //this.rebuildForm(); // Hvad skal vi gøre når der er postet?
	}

	prepareSaveProfile(): Profile {
    const formModel = this.profileForm.value;

    const saveProfile: Profile = {
        profileId: this.profile.profileId,
        email: this.profile.email,
        name: formModel.name as string,
        createdOn: this.profile.createdOn,
        updatedOn: this.profile.updatedOn,
        lastActive: this.profile.lastActive,
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
