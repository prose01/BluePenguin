import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

import { Profile } from './models/profile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
    title = 'BluePenguins';
    myProfile: Profile; /*find din profilId og indsæt her*/

  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }
  }
}
