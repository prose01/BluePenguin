import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile-listview',
  templateUrl: './profile-listview.component.html',
  styleUrls: ['./profile-listview.component.css']
})

export class ProfileListviewComponent implements OnInit {
  
  profiles: Profile[];
  selectedProfile: Profile;

  constructor(
  	private router: Router, 
  	private profileService: ProfileService
  	) { }  

  ngOnInit(): void {
    this.getProfiles();
  }

  getProfiles(): void {
    this.profileService.getProfiles().subscribe(profiles => this.profiles = profiles);
  }

  onSelect(profile: Profile): void {
    this.router.navigate(['/detail', profile.profileId]);
  }
}
