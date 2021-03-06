import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './authorisation/auth/auth.service';
import { CurrentUser } from './models/currentUser';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'PlusOne';
  currentUserSubject: CurrentUser;

  constructor(public auth: AuthService, private router: Router, private profileService: ProfileService) {
    auth.handleAuthentication();
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToProfileSearch() {
    this.router.navigate(['/profileSearch']); 
  }
}
