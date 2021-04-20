import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
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
import { ProfileFilter } from '../models/profileFilter';
import { BehaviorSubjectService } from '../services/behaviorSubjec.service';

@Component({
  selector: 'dashboard',
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

  previousProfiles: Profile[];
  currentProfiles: Profile[];
  nextProfiles: Profile[];
  filter: ProfileFilter = new ProfileFilter();
  viewFilterType: ViewFilterTypeEnum;
  displayedColumns: string[] = ['select', 'name', 'lastActive']; // TODO: Add columns after user's choise or just default?

  @Output("loadDetails") loadDetails: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private behaviorSubjectService: BehaviorSubjectService) { }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.getLatestProfiles(OrderByType.CreatedOn);
          this.getLatestProfilesNext(OrderByType.CreatedOn, 20, '1', '20');

          // Get and load previous ProfileFilter.
          this.behaviorSubjectService.currentProfileFilterSubject.subscribe(currentProfileFilterSubject => {
            this.filter = currentProfileFilterSubject;
          });
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
      case ViewFilterTypeEnum.ProfilesSearch: {
        this.getProfileByFilter(this.filter, OrderByType.CreatedOn, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      default: {
        this.getLatestProfiles(event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
    }
  }

  getNextTileData(event) {
    //this.previousProfiles = this.currentProfiles.length > event.pageSize ? this.currentProfiles.splice(0, event.pageSize) : this.currentProfiles; // TODO: Try to set array index to 0?
    this.currentProfiles = this.currentProfiles.concat(this.nextProfiles); // TODO: Wrong! This just adds a lot of profiles to array without removing any!!!

    //this.previousProfiles = [...this.currentProfiles]; // TODO: This alternative makes page jumpy and array index cannot be reset to 0 so we end up at buttom.
    //this.currentProfiles = [...this.nextProfiles]; 

    switch (event.viewFilterType) {
      case ViewFilterTypeEnum.LatestProfiles: {
        this.getLatestProfilesNext(event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.FilterProfiles: {
        this.getProfileByCurrentUsersFilterNext(event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.BookmarkedProfiles: {
        this.getBookmarkedProfilesNext(event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesSearch: {
        this.getProfileByFilterNext(this.filter, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      default: {
        this.getLatestProfilesNext(event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
    }
  }

  getPreviousTileData(event) {
    // TODO: Need to do the this.previousProfiles part if user scrolls back.
  }

  // Get latest Profiles.
  getLatestProfiles(selectedOrderBy: OrderByType, currentSize: number = 0, pageIndex: string = '0', pageSize: string = '20') {
    this.profileService.getLatestProfiles(selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;
          
          this.currentProfiles.push(...response);

          this.currentProfiles.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages(this.currentProfiles).then(() => { this.getProfileImages(this.currentProfiles) }) }
    );

    this.viewFilterType = ViewFilterTypeEnum.LatestProfiles;
  }

  getLatestProfilesNext(selectedOrderBy: OrderByType, currentSize: number = 0, pageIndex: string = '0', pageSize: string = '20') {
    this.profileService.getLatestProfiles(selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.nextProfiles = new Array;

          this.nextProfiles.length = currentSize;

          this.nextProfiles.push(...response);

          this.nextProfiles.length = this.nextProfiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages(this.nextProfiles).then(() => { this.getProfileImages(this.nextProfiles) }) }
      );
  }

  // Get Filtered Profiles.
  getProfileByCurrentUsersFilter(selectedOrderBy: OrderByType, currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getProfileByCurrentUsersFilter(selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.currentProfiles.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages(this.currentProfiles).then(() => { this.getProfileImages(this.currentProfiles) }) }
    );

    this.viewFilterType = ViewFilterTypeEnum.FilterProfiles;
  }

  getProfileByCurrentUsersFilterNext(selectedOrderBy: OrderByType, currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getProfileByCurrentUsersFilter(selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.nextProfiles = new Array;

          this.nextProfiles.length = currentSize;

          this.nextProfiles.push(...response);

          this.nextProfiles.length = this.nextProfiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages(this.nextProfiles).then(() => { this.getProfileImages(this.nextProfiles) }) }
      );
  }

  // Get Bookmarked Profiles.
  getBookmarkedProfiles(selectedOrderBy: OrderByType, currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {     // TODO: Add OrderByType to bookmarks also. Remeber Avalon
    this.profileService.getBookmarkedProfiles(selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.currentProfiles.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages(this.currentProfiles).then(() => { this.getProfileImages(this.currentProfiles) }) }
    );

    this.viewFilterType = ViewFilterTypeEnum.BookmarkedProfiles;
  }

  getBookmarkedProfilesNext(selectedOrderBy: OrderByType, currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getBookmarkedProfiles(selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.nextProfiles = new Array;

          this.nextProfiles.length = currentSize;

          this.nextProfiles.push(...response);

          this.nextProfiles.length = this.nextProfiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages(this.nextProfiles).then(() => { this.getProfileImages(this.nextProfiles) }) }
      );
  }

  // Get Profiles by searchfilter. 
  getProfileByFilter(filter: ProfileFilter, selectedOrderBy: OrderByType, currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getProfileByFilter(filter, selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.currentProfiles.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getSmallProfileImages(this.currentProfiles).then(() => { this.getProfileImages(this.currentProfiles) });
        }
      );

    this.viewFilterType = ViewFilterTypeEnum.ProfilesSearch;
  }

  getProfileByFilterNext(filter: ProfileFilter, selectedOrderBy: OrderByType, currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getProfileByFilter(filter, selectedOrderBy, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.nextProfiles = new Array;

          this.nextProfiles.length = currentSize;

          this.nextProfiles.push(...response);

          this.nextProfiles.length = this.nextProfiles.length + 1;
        }
        , () => { }
        , () => {
          this.getSmallProfileImages(this.nextProfiles).then(() => { this.getProfileImages(this.nextProfiles) });
        }
      );
  }

  // Get Profile Images.

  imageNumber: number = 0;

  getSmallProfileImages(profiles: Profile[]): Promise<void> {
    let defaultImageModel: ImageModel = new ImageModel();

    profiles?.forEach((element, i) => {
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

  getProfileImages(profiles: Profile[]): void {
    let defaultImageModel: ImageModel = new ImageModel();

    profiles?.forEach((element, i) => {
      if (element.images != null && element.images.length > 0) {
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

  toggleViewDisplay() {
    this.isTileView = !this.isTileView;
    this.matButtonToggleText = (this.isTileView ? 'ListView' : 'TileView');
    this.matButtonToggleIcon = (this.isTileView ? 'line_style' : 'collections');
  }

  resetSelectionPagination() {
    this.listviewComponent.resetSelectionPagination();
  }

  loadProfileDetails(profile: Profile) {
    this.loadDetails.emit(profile);
  }
}
