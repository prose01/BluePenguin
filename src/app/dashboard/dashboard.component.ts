import { Component, OnInit } from '@angular/core';
import { OktaAuthService } from '@okta/okta-angular';

import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  isAuthenticated: boolean;
  profiles: Profile[] = [];

  constructor(private profileService: ProfileService, public oktaAuth: OktaAuthService) { 
	// Subscribe to authentication state changes
    this.oktaAuth.$authenticationState.subscribe(
      (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    );
  }

  async ngOnInit() {
  	// Get the authentication state for immediate use
    this.isAuthenticated = await this.oktaAuth.isAuthenticated();

    this.profileService.getProfiles().subscribe(profiles => this.profiles = profiles.slice(5, 9));
  }

  login() {
    this.oktaAuth.loginRedirect('/dashboard.component');
  }

  logout() {
    this.oktaAuth.logout('/');
  }
}