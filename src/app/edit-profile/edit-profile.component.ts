
import {switchMap} from 'rxjs/operators';

import { Component, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';

import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})

export class EditProfileComponent implements OnChanges {
	@Input() profile : Profile;
	profileForm: FormGroup;

  	constructor(
	  private profileService: ProfileService,
	  private route: ActivatedRoute,
	  private location: Location,
	  private fb: FormBuilder) { this.createForm(); }

  	createForm() {
	    this.profileForm = this.fb.group({
	      name: ['', Validators.required ],		// sæt values fra start
	      body: '',
	      email: ''
	    });
  	}

  	ngOnChanges() { 
    	//this.rebuildForm();			// skal denne være der?
  	}

  	rebuildForm() {
  		this.profileForm.reset({
	      name: this.profile.name
	    });
    	// this.profileForm.reset();
    	// this.profileForm.patchValue({
     //  		name: this.profile.name
    	// });
  	}

  	onSubmit() {
	  this.profile = this.prepareSaveProfile();
	  this.profileService.updateProfile(this.profile).subscribe(/* add error handling */);
	  //this.rebuildForm(); // Hvad skal vi gøre når der er postet?
	}

	prepareSaveProfile(): Profile {
    const formModel = this.profileForm.value;

    const saveProfile: Profile = {
	      profileId: this.profile.profileId,
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
	    this.route.paramMap.pipe(
            switchMap((params: ParamMap) => this.profileService.getCurrentUserProfile()))
	      .subscribe(profile => this.profile = profile);
	      //this.rebuildForm();
	}

	//goBack(): void {
	//  this.location.back();
	//}

}
