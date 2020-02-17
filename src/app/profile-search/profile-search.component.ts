import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProfileFilter } from '../models/profileFilter';
import { Profile } from '../models/profile';
import { GenderType, BodyType } from '../models/enums';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent implements OnInit {
  filter: ProfileFilter;
  searchResultProfiles: Profile[];
  profileForm: FormGroup;
  genderTypes = Object.keys(GenderType);
  bodyTypes = Object.keys(BodyType);
  ageList: number[] = [...Array(10).keys()];
  heightList: number[] = [...Array(10).keys()];
  weightList: number[] = [...Array(10).keys()];

  constructor(private profileService: ProfileService, private formBuilder: FormBuilder) { this.createForm(); }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: null,
      age: null,
      height: null,
      weight: null,
      description: null,
      gender: GenderType.Female,
      body: BodyType.Atletic
    });
  }

  ngOnInit() {
    this.filter = new ProfileFilter();
  }

  rebuildForm() {
    this.profileForm.reset({
      name: null,
      age: null,
      height: null,
      weight: null,
      description: null,
      gender: GenderType.Female,
      body: BodyType.Atletic
    });
  }

  onSubmit() {
    this.filter = this.prepareSearch();
    this.profileService.getProfileByFilter(this.filter).subscribe(searchResultProfiles => this.searchResultProfiles = searchResultProfiles);
  }

  revert() { this.rebuildForm(); }

  prepareSearch(): ProfileFilter {
    const formModel = this.profileForm.value;

    const filterProfile: ProfileFilter = {
      name: formModel.name as string,
      createdOn: new Date() as Date,
      updatedOn: new Date() as Date,
      lastActive: new Date() as Date,
      age: formModel.age as number[],
      height: formModel.height as number[],
      weight: formModel.weight as number[],
      description: formModel.description as string,
      gender: formModel.gender as GenderType,
      body: formModel.body as BodyType,
    };

    return filterProfile;
  }
}
