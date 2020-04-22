import { Component, OnInit } from '@angular/core';

import { AuthService } from './../authorisation/auth/auth.service';
import { Profile } from '../models/profile';
import { ImageModel } from '../models/ImageModel';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  isMatButtonToggled = true;
  matButtonToggleText: string = 'TileView';

  profiles: Profile[];

  constructor(public auth: AuthService, private profileService: ProfileService) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) { this.getLatestCreatedProfiles(); }
      });
    }
  }

  getLatestCreatedProfiles() {
    this.profileService.getLatestCreatedProfiles().subscribe(profiles => this.profiles = profiles);

    setTimeout(() => { this.getProfileImages(); }, 1000);  // Find på noget bedre end at vente 2 sek.
  }

  getLastUpdatedProfiles() {
    this.profileService.getLastUpdatedProfiles().subscribe(profiles => this.profiles = profiles);

    setTimeout(() => { this.getProfileImages(); }, 1000);  // Find på noget bedre end at vente 2 sek.
  }

  getLastActiveProfiles() {
    this.profileService.getLastActiveProfiles().subscribe(profiles => this.profiles = profiles);

    setTimeout(() => { this.getProfileImages(); }, 1000);  // Find på noget bedre end at vente 2 sek.
  }

  getBookmarkedProfiles() {
    this.profileService.getBookmarkedProfiles().subscribe(profiles => this.profiles = profiles);

    setTimeout(() => { this.getProfileImages(); }, 1000);  // Find på noget bedre end at vente 2 sek.
  }

  getProfileImages(): void {
    let defaultImageModel: ImageModel = new ImageModel();
    this.profileService.getProfileImageByFileName('0', 'person-icon').subscribe(images => defaultImageModel.image = 'data:image/png;base64,' + images.toString());

    this.profiles.forEach((element, i) => {
      if (element.images != null && element.images.length > 0) {
        // Take a random image from profile.
        let imageNumber = this.randomIntFromInterval(0, element.images.length - 1);
        //Just insert it into the first[0] element as we will only show one image.
        this.profileService.getProfileImageByFileName(element.profileId, element.images[imageNumber].fileName).subscribe(images => element.images[0].image = 'data:image/png;base64,' + images.toString());
      }
      else {
        // Set default profile image.
        element.images.push(defaultImageModel);
      }
    });
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }


  toggleDisplay() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'TileView' : 'ListView');
  }

}
