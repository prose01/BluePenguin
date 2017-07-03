import { Component, Input } from '@angular/core';
import { Profile } from './profile';

@Component({
  selector: 'profile-detail',
  template: `
		<div *ngIf="profile">
		  <h2>{{profile.name}} details!</h2>
		  <div><label>id: </label>{{profile.id}}</div>
		  <div>
		      <label>name: </label>
		      <input [(ngModel)]="profile.name" placeholder="name">
		  </div>
		</div>
  `
})

export class ProfileDetailComponent {
	@Input() profile: Profile;
}