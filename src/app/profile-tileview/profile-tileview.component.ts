import { Component, Input, OnInit } from '@angular/core';
//import { Router } from '@angular/router';

import { Profile } from '../models/profile';
//import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.css']
})

export class ProfileTileviewComponent implements OnInit {

  selectedProfile: Profile;

  @Input() profiles: Profile[];

  constructor() { }  

  ngOnInit(): void {
    //this.getProfiles();
  }

  //getProfiles(): void {
  //  this.profileService.getProfiles().subscribe(profiles => this.profiles = profiles);
  //}

  //onSelect(profile: Profile): void {
  //  this.router.navigate(['/detail', profile.profileId]);
  //}
}
