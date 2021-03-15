import { Component, OnInit, ViewChild } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from './../authorisation/auth/auth.service';
import { Profile } from '../models/profile';
import { ImageModel } from '../models/imageModel';
import { ProfileService } from '../services/profile.service';
import { ImageService } from '../services/image.service';
import { OrderByType } from '../models/enums';
import { ImageSizeEnum } from '../models/imageSizeEnum';
import { ViewFilterTypeEnum } from '../models/viewFilterTypeEnum';
import { ProfileListviewComponent } from '../views/profile-listview/profile-listview.component';

@Component({
  selector: 'my-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

@AutoUnsubscribe()
export class DashboardComponent implements OnInit {
  @ViewChild(ProfileListviewComponent)
  private listviewComponent: ProfileListviewComponent;

  isTileView = true;
  matButtonToggleText: string = 'ListView';
  matButtonToggleIcon: string = 'line_style';

  profiles: Profile[];
  viewFilterType: ViewFilterTypeEnum;
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
        if (currentUser) { this.getLatestProfiles(); }
      });
    }
  }

  // https://paulrohan.medium.com/angular-avoiding-subscribe-method-by-replacing-it-with-an-asynpipe-when-possible-a92c20793357
  //ngOnDestroy() {
  //  if (this.subscription) {
  //    this.subscription.unsubscribe();
  //  }
  //}

  getNextData(event) {
    switch (event.viewFilterType) {
      case ViewFilterTypeEnum.LatestProfiles: {
        this.getLatestProfiles(event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.FilterProfiles: {
        this.getProfileByCurrentUsersFilter(event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.BookmarkedProfiles: {
        this.getBookmarkedProfiles(event.currentSize, event.pageIndex, event.pageSize);        
        break;
      }
      default: {
        this.getLatestProfiles(event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
    }
  }

  // Get latest Profiles.
  getLatestProfiles(currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getLatestProfiles(this.selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.profiles = new Array;

          this.profiles.length = currentSize;
          
          this.profiles.push(...response);

          this.profiles.length = this.profiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages().then(() => { this.getProfileImages() }) }
      );
    this.showingBookmarkedProfilesList = false;
    this.viewFilterType = ViewFilterTypeEnum.LatestProfiles;
  }

  // Get Filtered Profiles.
  getProfileByCurrentUsersFilter(currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getProfileByCurrentUsersFilter(this.selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.profiles = new Array;

          this.profiles.length = currentSize;

          this.profiles.push(...response);

          this.profiles.length = this.profiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages().then(() => { this.getProfileImages() }) }
      );
    this.showingBookmarkedProfilesList = false;
    this.viewFilterType = ViewFilterTypeEnum.FilterProfiles;
  }

  // Get Bookmarked Profiles.
  getBookmarkedProfiles(currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getBookmarkedProfiles(pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.profiles = new Array;

          this.profiles.length = currentSize;

          this.profiles.push(...response);

          this.profiles.length = this.profiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages().then(() => { this.getProfileImages() }) }
      );
    this.showingBookmarkedProfilesList = true;
    this.viewFilterType = ViewFilterTypeEnum.BookmarkedProfiles;
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

  resetSelectionPagination() {
    this.listviewComponent.resetSelectionPagination();
  }
}
