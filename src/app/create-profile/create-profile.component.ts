
import { Component, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';

import { Profile } from '../models/profile';
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
	  private route: ActivatedRoute,
	  private location: Location,
	  private fb: FormBuilder) { this.createForm(); }

  createForm() {
	    this.profileForm = this.fb.group({
	      name: ['', Validators.required ],
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
	      profileId: '',									// sæt til noget eller fjern
	      name: formModel.name as string,
	      body: formModel.body as string,
	      email: formModel.email as string,
	      updatedOn: '2018-06-27T11:41:16.562Z' as string,	// sæt til ingenting eller datetime.now
	      createdOn: '2018-06-27T11:41:16.562Z' as string
	    };
	    return saveProfile;
	}

  	revert() { this.rebuildForm(); }

  	ngOnInit(): void {
	}

	goBack(): void {
	  this.location.back();
	}
}
