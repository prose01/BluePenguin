import { Component, OnInit } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from './../authorisation/auth/auth.service';
import { Profile } from '../models/profile';
import { ImageModel } from '../models/imageModel';
import { ProfileService } from '../services/profile.service';
import { ImageService } from '../services/image.service';
import { ProfilesDataSource } from '../services/profilesDataSource.service';
import { OrderByType } from '../models/enums';
import { ImageSizeEnum } from '../models/imageSizeEnum';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

@AutoUnsubscribe()
export class DashboardComponent implements OnInit {
  dataSource: ProfilesDataSource;
  isTileView = true;
  matButtonToggleText: string = 'ListView';
  matButtonToggleIcon: string = 'line_style';

  profiles: Profile[];
  displayedColumns: string[] = ['select', 'name', 'lastActive']; // Add columns after user's choise or just default?
  showingBookmarkedProfilesList: boolean;

  orderBy: any[] = [
    { value: OrderByType.CreatedOn, viewValue: 'CreatedOn' },   //most recent
    { value: OrderByType.UpdatedOn, viewValue: 'UpdatedOn' },
    { value: OrderByType.LastActive, viewValue: 'LastActive' }
  ];
  selectedOrderBy = this.orderBy[0].value;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.dataSource = new ProfilesDataSource(this.profileService);
          this.getLatestProfiles();
        }
      });
    }
  }

  // https://paulrohan.medium.com/angular-avoiding-subscribe-method-by-replacing-it-with-an-asynpipe-when-possible-a92c20793357
  //ngOnDestroy() {
  //  if (this.subscription) {
  //    this.subscription.unsubscribe();
  //  }
  //}

  // Get latest Profiles.
  getLatestProfiles() {
    //this.dataSource.loadProfiles(OrderByType.CreatedOn, 'desc', '1', '2');
    //this.dataSource.currentProfilesSubject.subscribe(profiles => this.profiles = profiles);
    this.profileService.getLatestProfiles(this.selectedOrderBy, 'desc', '0', '5')
      .pipe(takeWhileAlive(this))
      .subscribe(

        (response: any) => {

          this.profiles = new Array;
          //this.profiles.length = 30;
          this.profiles.push(...response);

          this.profiles.length = this.profiles.length + 1;
        }

        //profiles => this.profiles = profiles
        , () => { }
        , () => { this.getSmallProfileImages().then(() => { this.getProfileImages() }) }
      );
    this.showingBookmarkedProfilesList = false;
  }

  //loadLessonsPage(value) {
  //  this.dataSource.loadProfiles(OrderByType.CreatedOn, 'desc', value.pageIndex.toString(), value.pageSize.toString());
  //}

  // Get Filtered Profiles.
  getProfileByCurrentUsersFilter() {
    this.profileService.getProfileByCurrentUsersFilter(this.selectedOrderBy)
      .pipe(takeWhileAlive(this))
      .subscribe(profiles => this.profiles = profiles, () => { }, () => { this.getSmallProfileImages().then(() => { this.getProfileImages() }) });
    this.showingBookmarkedProfilesList = false;
  }

  // Get Bookmarked Profiles.
  getBookmarkedProfiles() {
    this.profileService.getBookmarkedProfiles()
      .pipe(takeWhileAlive(this))
      .subscribe(profiles => this.profiles = profiles, () => { }, () => { this.getSmallProfileImages().then(() => { this.getProfileImages() }) });
    this.showingBookmarkedProfilesList = true;
  }

  imageNumber: number; // TODO: Find på noget bedre!

  getSmallProfileImages(): Promise<void> {
    let defaultImageModel: ImageModel = new ImageModel();

    this.profiles?.forEach((element, i) => {
      if (element.images != null && element.images.length > 0) {
        // Take a random image from profile.
        this.imageNumber = this.randomIntFromInterval(0, element.images.length - 1);
        //Just insert it into the first[0] element as we will only show one image.
        this.imageService.getProfileImageByFileName(element.profileId, element.images[this.imageNumber].fileName, ImageSizeEnum.small)
          .pipe(takeWhileAlive(this))
          .subscribe(images => element.images[0].image = 'data:image/png;base64,' + images.toString());
      }
      else {
        // Set default profile image.
        element.images.push(defaultImageModel);
      }
    });

    return Promise.resolve();
  }

  getProfileImages(): void {
    let defaultImageModel: ImageModel = new ImageModel();

    this.profiles?.forEach((element, i) => {
      if (element.images != null && element.images.length > 0) {
        // Take a random image from profile.
        //let imageNumber = this.randomIntFromInterval(0, element.images.length - 1);
        //Just insert it into the first[0] element as we will only show one image.
        this.imageService.getProfileImageByFileName(element.profileId, element.images[this.imageNumber].fileName, ImageSizeEnum.large)
          .pipe(takeWhileAlive(this))
          .subscribe(images => element.images[0].image = 'data:image/png;base64,' + images.toString());
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
    this.matButtonToggleIcon = (this.isTileView ? 'line_style' : 'collections');
  }

}
