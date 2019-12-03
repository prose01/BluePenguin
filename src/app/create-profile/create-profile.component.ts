
import { Component, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Profile, GenderType } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'create-profile',
  templateUrl: './create-profile.component.html',
  styleUrls: ['./create-profile.component.css']
})

export class CreateProfileComponent implements OnChanges {
	profile : Profile;
	profileForm: FormGroup;

  constructor(
	  private profileService: ProfileService,
	  private fb: FormBuilder) { this.createForm(); }

  createForm() {
	    this.profileForm = this.fb.group({
	      name: ['', Validators.required ],
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
	  this.profile = this.prepareSaveProfile();
	  this.profileService.addProfile(this.profile).subscribe(/* add error handling */);
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

  revert() { this.rebuildForm(); }

  ngOnInit(): void {
	}
}
