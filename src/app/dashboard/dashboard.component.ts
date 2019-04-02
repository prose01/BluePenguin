import { Component, OnInit } from '@angular/core';

import { AuthService } from './../auth/auth.service';
import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  profiles: Profile[] = [];

  constructor(private auth: AuthService, private profileService: ProfileService) { }

  ngOnInit(): void {
    //this.profileService.getProfiles().subscribe(profiles => this.profiles = profiles.slice(5, 9));
  }
}