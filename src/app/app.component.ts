import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>
    <nav>

     <div class="container-fluid">
      <form class="form-inline">

        <button id="qsLoginBtn"
          class="btn btn-primary my-2 my-sm-0"
          *ngIf="!auth.isAuthenticated()"
          (click)="auth.login()" type="button">
            Log In
        </button>

        <button id="qsLogoutBtn"
          class="btn btn-primary my-2 my-sm-0"
          *ngIf="auth.isAuthenticated()"
          (click)="auth.logout()" type="button">
            Log Out
        </button>

      </form>
    </div>

    <div *ngIf="auth.isAuthenticated()">
      <a routerLink="/dashboard">Dashboard</a>
      <a routerLink="/profiles">Profiles</a>
      <a routerLink="/create">Create new Profile</a>
    </div>

     
   	</nav>
   	<router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'BluePenguins';

  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }
  }
}