import { Component, OnInit } from '@angular/core';

import { Profile } from './profile';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-root',
  //templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  template: `
	  <h1>{{title}}</h1>
	  <h2>My Profiles</h2>
		<ul class="profiles">
		  <li *ngFor="let profile of profiles" [class.selected]="profile === selectedProfile" (click)="onSelect(profile)">
		    <span class="badge">{{profile.id}}</span> {{profile.name}}
		  </li>
		</ul>
		<profile-detail [profile]="selectedProfile"></profile-detail>
  `,
  styles: [`
  .selected {
    background-color: #CFD8DC !important;
    color: white;
  }
  .profiles {
    margin: 0 0 2em 0;
    list-style-type: none;
    padding: 0;
    width: 15em;
  }
  .profiles li {
    cursor: pointer;
    position: relative;
    left: 0;
    background-color: #EEE;
    margin: .5em;
    padding: .3em 0;
    height: 1.6em;
    border-radius: 4px;
  }
  .profiles li.selected:hover {
    background-color: #BBD8DC !important;
    color: white;
  }
  .profiles li:hover {
    color: #607D8B;
    background-color: #DDD;
    left: .1em;
  }
  .profiles .text {
    position: relative;
    top: -3px;
  }
  .profiles .badge {
    display: inline-block;
    font-size: small;
    color: white;
    padding: 0.8em 0.7em 0 0.7em;
    background-color: #607D8B;
    line-height: 1em;
    position: relative;
    left: -1px;
    top: -4px;
    height: 1.8em;
    margin-right: .8em;
    border-radius: 4px 0 0 4px;
  }
`],
	providers: [ProfileService]
})

export class AppComponent implements OnInit {
  title = 'BluePenguins';
  profiles: Profile[];
  selectedProfile: Profile;

  constructor(private profileService: ProfileService) { }

  getProfiles(): void {
  	this.profileService.getProfiles().then(profiles => this.profiles = profiles);
  }

  ngOnInit(): void {
  	this.getProfiles();
  }

  onSelect(profile: Profile): void {
  	this.selectedProfile = profile;
  }
}
