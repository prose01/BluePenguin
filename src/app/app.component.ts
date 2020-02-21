import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

import { ProfileService } from './services/profile.service';
//import { CurrentUser } from './models/currentUser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'BluePenguins';
  //currentProfile: CurrentUser;

  constructor(public auth: AuthService, private profileService: ProfileService) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();

      //this.profileService.currentProfile.subscribe(currentProfile => this.currentProfile = currentProfile);
    }
  }
}
