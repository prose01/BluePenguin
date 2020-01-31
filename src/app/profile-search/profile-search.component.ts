import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { Profile, GenderType, BodyType } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent implements OnInit {
  filter: Profile;
  searchResultProfiles: Profile[];
  profileForm: FormGroup;
  genderTypes = Object.keys(GenderType);
  bodyTypes = Object.keys(BodyType);

  constructor(private profileService: ProfileService, private formBuilder: FormBuilder) { this.createForm(); }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: '',
      age: '',
      height: '',
      weight: '',
      description: '',
      genderType: '',
      bodyType: ''
    });
  }

  ngOnInit() {
    this.filter = new Profile();
  }

  rebuildForm() {
  		this.profileForm.reset({
        name: '',
        age: '',
        height: '',
        weight: '',
        description: '',
        genderType: '',
        bodyType: ''
	    });
  }

  onSubmit() {
    this.filter = this.prepareSearch();
    this.profileService.getProfileByFilter(this.filter).subscribe(searchResultProfiles => this.searchResultProfiles = searchResultProfiles);
  }

  revert() { this.rebuildForm(); }

  prepareSearch(): Profile {
    const formModel = this.profileForm.value;

    const filterProfile: Profile = {      // alle properties SKAL være sat til noget for at kaldet virker!!!!
      bookmarks: ['Apple', 'Orange', 'Banana'] as string[],
      profileId: '123ID' as string,
      email: 'some@thing' as string,
      name: formModel.name as string,
      createdOn: new Date() as Date,
      updatedOn: new Date() as Date,
      lastActive: new Date() as Date,
      age: formModel.age as number,
      height: formModel.height as number,
      weight: formModel.weight as number,
      description: 'some@thing' as string,
      gender: GenderType.Male as GenderType,
      body: BodyType.Atletic as BodyType,
    };

    return filterProfile;
  }

  // call profileService to get a search result and add it to this.searchResultProfiles

  // add an *ngIf="searchResultProfiles is not empty" to the <app-profile-listview>

  // Add a button link to the search page, add the search page to the routing etc.

}
