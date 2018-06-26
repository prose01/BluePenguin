import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

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
  	this.profileService.getProfiles().subscribe(profiles => this.profiles = profiles);
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

  gotoEdit(): void {
  this.router.navigate(['/edit', this.selectedProfile.profileId]);
  }
}
