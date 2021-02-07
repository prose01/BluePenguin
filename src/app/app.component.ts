import { Component, OnInit, isDevMode } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './authorisation/auth/auth.service';
import { CurrentUser } from './models/currentUser';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'PlusOne';
  currentUserSubject: CurrentUser;

  useChat = false; // Get from Config! Turns off Chat :)

  isDev = isDevMode();
  siteLanguage: string
  siteLocale: string
  languageList = [
    { code: 'en', label: 'English', alpha2: 'gb' },
    { code: 'da', label: 'Danish', alpha2: 'dk' }
  ]

  constructor(public auth: AuthService, private router: Router, private profileService: ProfileService) {
    auth.handleAuthentication();
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }

    if (this.auth.isAuthenticated()) {
      this.siteLocale = window.location.pathname.split('/')[1]
      this.siteLanguage = this.languageList.find(
        (f) => f.code === this.siteLocale
      )?.label
      if (!this.siteLanguage) {
        this.onChange(this.languageList[0].code)
      }
    }
  }

  onChange(selectedLangCode: string) {
    window.location.href = `/${selectedLangCode}`
    console.log(selectedLangCode); // Does not seem to work
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goToProfileSearch() {
    this.router.navigate(['/search']);
  }
}
