import { Component } from '@angular/core';

export class Profile {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  //templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
	  <h1>{{title}}</h1>
	  <h2>{{profile.name}} details!</h2>
	  <div><label>id: </label>{{profile.id}}</div>
	  <div>
	      <label>name: </label>
	      <input [(ngModel)]="profile.name" placeholder="name">
	  </div>
  `
})

export class AppComponent {
  title = 'BluePenguins';
  profile : Profile = {
	  id: 1,
	  name: 'Windstorm'
	};
}
