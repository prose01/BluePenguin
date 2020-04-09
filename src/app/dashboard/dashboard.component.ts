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

  isMatButtonToggled = true;
  matButtonToggleText: string = 'TileView';

  profiles: Profile[];

  constructor(public auth: AuthService, private profileService: ProfileService) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) { this.getLatestCreatedProfiles(); }
      });
    }
  }

  getLatestCreatedProfiles() {
    this.profileService.getLatestCreatedProfiles().subscribe(profiles => this.profiles = profiles);
  }

  getLastUpdatedProfiles() {
    this.profileService.getLastUpdatedProfiles().subscribe(profiles => this.profiles = profiles);
  }

  getLastActiveProfiles() {
    this.profileService.getLastActiveProfiles().subscribe(profiles => this.profiles = profiles);
  }

  getBookmarkedProfiles() {
    this.profileService.getBookmarkedProfiles().subscribe(profiles => this.profiles = profiles);
  }


  toggleDisplay() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'TileView' : 'ListView');
  }

}
