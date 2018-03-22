import { Component, OnInit } from '@angular/core';

import { Profile } from './profile';
import { ProfileService } from './profile.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  profiles: Profile[] = [];

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    // this.profileService.getProfiles().then(profiles => this.profiles = profiles.slice(5, 9));
    this.profileService.getTest();
  }
}