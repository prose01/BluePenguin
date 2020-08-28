import { Component, OnInit } from '@angular/core';

import { AuthService } from './../authorisation/auth/auth.service';
import { Profile } from '../models/profile';
import { ImageModel } from '../models/ImageModel';
import { ProfileService } from '../services/profile.service';
import { ImageService } from '../services/image.service';
import { OrderByType } from '../models/enums';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit {

  isTileView = true;
  matButtonToggleText: string = 'ListView';

  profiles: Profile[];
  showingBookmarkedProfilesList: boolean;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) { this.getProfileByCurrentUsersFilter(); }
      });
    }
  }


  getBookmarkedProfiles() {
    this.profileService.getBookmarkedProfiles().subscribe(profiles => this.profiles = profiles, () => { }, () => { this.getProfileImages() });
    this.showingBookmarkedProfilesList = true;
  }

  // Get Filtered Profiles with OrderByType.
  getProfileByCurrentUsersFilter() {
    this.profileService.getProfileByCurrentUsersFilter(OrderByType.CreatedOn).subscribe(profiles => this.profiles = profiles, () => { }, () => { this.getProfileImages() });
    this.showingBookmarkedProfilesList = false;
  }

  // Get latest Profiles with OrderByType.
  getLatestCreatedProfiles() {
    this.profileService.getLatestProfiles(OrderByType.CreatedOn).subscribe(profiles => this.profiles = profiles, () => { }, () => { this.getProfileImages() });
    this.showingBookmarkedProfilesList = false;
  }

  getLastUpdatedProfiles() {
    this.profileService.getLatestProfiles(OrderByType.UpdatedOn).subscribe(profiles => this.profiles = profiles, () => { }, () => { this.getProfileImages() });
    this.showingBookmarkedProfilesList = false;
  }

  getLastActiveProfiles() {
    this.profileService.getLatestProfiles(OrderByType.LastActive).subscribe(profiles => this.profiles = profiles, () => { }, () => { this.getProfileImages() });
    this.showingBookmarkedProfilesList = false;
  }

  getProfileImages(): void {
    let defaultImageModel: ImageModel = new ImageModel();
    this.imageService.getProfileImageByFileName('0', 'person-icon').subscribe(images => defaultImageModel.image = 'data:image/png;base64,' + images.toString());

    this.profiles.forEach((element, i) => {
      if (element.images != null && element.images.length > 0) {
        // Take a random image from profile.
        let imageNumber = this.randomIntFromInterval(0, element.images.length - 1);
        //Just insert it into the first[0] element as we will only show one image.
        this.imageService.getProfileImageByFileName(element.profileId, element.images[imageNumber].fileName).subscribe(images => element.images[0].image = 'data:image/png;base64,' + images.toString());
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
    this.isTileView = !this.isTileView;
    this.matButtonToggleText = (this.isTileView ? 'ListView' : 'TileView');
  }

}
