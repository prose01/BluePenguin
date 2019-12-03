import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Profile, GenderType } from '../models/profile';
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

  constructor(
	private profileService: ProfileService,
  private formBuilder: FormBuilder) { this.createForm(); }

  createForm() {
      this.profileForm = this.formBuilder.group({
	      name: '',
        description: '',
        genderType: ''
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
        name: this.profile.name,
        description: this.profile.description,
        genderType: this.profile.gender
      });
  }

  rebuildForm() {
  		this.profileForm.reset({
        name: this.profile.name,
        description: this.profile.description,
        genderType: this.profile.gender
	    });
  }

  revert() { this.rebuildForm(); }

  onSubmit() {
	  this.profile = this.prepareSaveProfile();
    this.profileService.putProfile(this.profile).subscribe(/* add error handling */);
	  //this.rebuildForm(); // Hvad skal vi gøre når der er postet?
	}

	prepareSaveProfile(): Profile {
    const formModel = this.profileForm.value;

    const saveProfile: Profile = {
	      profileId: this.profile.profileId,
        name: formModel.name as string,
        description: formModel.description as string,
        gender: formModel.gender as GenderType,
        body: '098' as string,
        email: this.profile.email,
        updatedOn: this.profile.updatedOn,
        createdOn: this.profile.createdOn
	    };

    return saveProfile;
	}

}
