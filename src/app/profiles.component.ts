import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Profile } from './profile';
import { ProfileService } from './profile.service';

@Component({
  selector: 'my-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: [ './profiles.component.css' ]
})

export class ProfilesComponent implements OnInit {
  profiles: Profile[];
  selectedProfile: Profile;

  constructor(
  	private router: Router, 
  	private profileService: ProfileService
  	) { }

  getProfiles(): void {
  	this.profileService.getProfiles().then(profiles => this.profiles = profiles);
  }

  ngOnInit(): void {
  	this.getProfiles();
  }

  onSelect(profile: Profile): void {
 	this.selectedProfile = profile;
  }

  gotoDetail(): void {
	this.router.navigate(['/detail', this.selectedProfile.profileId]);
  }
}
