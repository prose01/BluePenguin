import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>{{title}}</h1>
    <nav>
     <a routerLink="/dashboard">Dashboard</a>
     <a routerLink="/profiles">Profiles</a>
     <a routerLink="/create">Create new Profile</a>
   	</nav>
   	<router-outlet></router-outlet>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'BluePenguins';
}