import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
//import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationLoader } from '../configuration/configuration-loader.service';

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
import { ErrorDialog } from '../error-dialog/error-dialog.component';
import { CurrentUser } from '../models/currentUser';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.scss' ]
})

//@AutoUnsubscribe()
export class DashboardComponent implements OnInit {
  @ViewChild(ProfileListviewComponent)
  private listviewComponent: ProfileListviewComponent;

  currentUserSubject: CurrentUser;

  loading: boolean = false;
  isTileView = true;

  length: number;

  previousProfiles: Profile[];
  currentProfiles: Profile[];
  nextProfiles: Profile[];
  filter: ProfileFilter = new ProfileFilter();

  viewFilterType: ViewFilterTypeEnum = ViewFilterTypeEnum.LatestProfiles;
  orderBy: OrderByType = OrderByType.LastActive;

  defaultPageSize: number;

  displayedColumns: string[] = ['select', 'name', 'lastActive', 'visit/book', 'favorites', 'likes', 'contactable']; // TODO: Add columns after user's choise or just default?

  @Output("loadDetails") loadDetails: EventEmitter<any> = new EventEmitter();
  @Output("isCurrentUserCreated") isCurrentUserCreated: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private behaviorSubjectService: BehaviorSubjectService, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.defaultPageSize = this.configurationLoader.getConfiguration().defaultPageSize;
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });
        if (currentUser) {
          this.isCurrentUserCreated.emit({ isCreated: true, languagecode: this.currentUserSubject.languagecode });
          this.initDefaultData();
        }
        else {
          this.isCurrentUserCreated.emit({ isCreated: true, languagecode: this.currentUserSubject.languagecode });
        }
      },
        (error: any) => {
          if (error.status === 0) {
            // A network error occurred.
            this.openErrorDialog('No connection to server', null);
          }
        }
      );

      // Get and load previous ProfileFilter.
      this.behaviorSubjectService.currentProfileFilterSubject.subscribe(currentProfileFilterSubject => {
        this.filter = currentProfileFilterSubject;
      });
    }
  }

  initDefaultData() {
      this.getLatestProfiles(); // TODO: See if this can be removed
  }

  getNextData(event) {
    switch (this.viewFilterType) {
      case ViewFilterTypeEnum.LatestProfiles: {
        this.getLatestProfiles(this.orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.FilterProfiles: {
        this.getProfileByCurrentUsersFilter(this.orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.BookmarkedProfiles: {
        this.getBookmarkedProfiles(this.orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesSearch: {
        this.getProfileByFilter(this.filter, this.orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoVisitedMe: {
        this.getProfilesWhoVisitedMe(this.orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoBookmarkedMe: {
        this.getProfilesWhoBookmarkedMe(this.orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoLikesMe: {
        this.getProfilesWhoLikesMe(this.orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      default: {
        this.getLatestProfiles(this.orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
    }
  }

  // Get latest Profiles. 
  private getLatestProfiles(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize) {
    console.log('getLatestProfiles ' + 'selectedOrderBy ' + selectedOrderBy + ' currentSize ' + currentSize + ' pageIndex ' + pageIndex + ' pageSize ' + pageSize);
    this.profileService.getLatestProfiles(selectedOrderBy, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;
          
          this.currentProfiles.push(...response);

          this.length = this.currentProfiles.length + 1;
        },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('ProfileChatListviewComponent.CouldNotGetMessages'), null); this.loading = false;  // TODO: Add openErrorDialog message
        },
        () => { this.getProfileImages(this.currentProfiles); }
    );
  }

  // Get Filtered Profiles.
  private getProfileByCurrentUsersFilter(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize) {
    console.log('getProfileByCurrentUsersFilter ' + 'selectedOrderBy ' + selectedOrderBy + ' currentSize ' + currentSize + ' pageIndex ' + pageIndex + ' pageSize ' + pageSize);
    this.profileService.getProfileByCurrentUsersFilter(selectedOrderBy, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getProfileImages(this.currentProfiles); }
    );
  }

  // Get Bookmarked Profiles.
  private getBookmarkedProfiles(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize) {
    console.log('getBookmarkedProfiles ' + 'selectedOrderBy ' + selectedOrderBy + ' currentSize ' + currentSize + ' pageIndex ' + pageIndex + ' pageSize ' + pageSize);
    this.profileService.getBookmarkedProfiles(selectedOrderBy, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getProfileImages(this.currentProfiles); }
    );
  }

  // Get Profiles by searchfilter. 
  private getProfileByFilter(filter: ProfileFilter, selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize) {
    console.log('getProfileByFilter ' + 'selectedOrderBy ' + selectedOrderBy + ' currentSize ' + currentSize + ' pageIndex ' + pageIndex + ' pageSize ' + pageSize);
    this.profileService.getProfileByFilter(filter, selectedOrderBy, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getProfileImages(this.currentProfiles); }
      );
  }

  // Get Profiles who has visited my profile.
  private getProfilesWhoVisitedMe(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize) {
    console.log('getProfilesWhoVisitedMe ' + 'selectedOrderBy ' + selectedOrderBy + ' currentSize ' + currentSize + ' pageIndex ' + pageIndex + ' pageSize ' + pageSize);
    this.profileService.getProfilesWhoVisitedMe(selectedOrderBy, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getProfileImages(this.currentProfiles); }
      );
  }

  // Get Profiles who has visited my profile.
  private getProfilesWhoBookmarkedMe(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize) {
    console.log('getProfilesWhoBookmarkedMe ' + 'selectedOrderBy ' + selectedOrderBy + ' currentSize ' + currentSize + ' pageIndex ' + pageIndex + ' pageSize ' + pageSize);
    this.profileService.getProfilesWhoBookmarkedMe(selectedOrderBy, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getProfileImages(this.currentProfiles); }
      );
  }

  // Get Profiles who like my profile.
  private getProfilesWhoLikesMe(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize) {
    console.log('getProfilesWhoLikesMe ' + 'selectedOrderBy ' + selectedOrderBy + ' currentSize ' + currentSize + ' pageIndex ' + pageIndex + ' pageSize ' + pageSize);
    this.profileService.getProfilesWhoLikesMe(selectedOrderBy, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.currentProfiles = new Array;

          this.currentProfiles.length = currentSize;

          this.currentProfiles.push(...response);

          this.length = this.currentProfiles.length + 1;
        }
        , () => { }
        , () => { this.getProfileImages(this.currentProfiles); }
      );
  }

  // Get Profile Images.

  getProfileImages(profiles: Profile[]): Promise<void> {

    // Remove empty profile from array.
    profiles = profiles?.filter(function (el) {
      return el != null;
    });

    let defaultImageModel: ImageModel = new ImageModel();

    profiles?.forEach((element, i) => {
      // Take a random image from profile.
      element.imageNumber = this.randomIntFromInterval(0, element.images.length - 1);

      if (element.images != null && element.images.length > 0 && typeof element.images[element.imageNumber].fileName !== 'undefined') {
        this.loading = true;
        
        this.imageService.getProfileImageByFileName(element.profileId, element.images[element.imageNumber].fileName, ImageSizeEnum.small)
          //.pipe(takeWhileAlive(this))
          .subscribe(
            images => { element.images[element.imageNumber].smallimage = 'data:image/jpeg;base64,' + images.toString() },
            () => { this.loading = false; element.images[element.imageNumber].smallimage = defaultImageModel.smallimage },
            () => { this.loading = false; } 
          );
        
        this.imageService.getProfileImageByFileName(element.profileId, element.images[element.imageNumber].fileName, ImageSizeEnum.large)
          //.pipe(takeWhileAlive(this))
          .subscribe(
            images => { element.images[element.imageNumber].image = 'data:image/jpeg;base64,' + images.toString() },
            () => { this.loading = false; element.images[element.imageNumber].image = defaultImageModel.image },
            () => { this.loading = false; }
          );
      }
      else {
        // Set default profile image.
        element.images[0] = defaultImageModel;
      }
    });

    return Promise.resolve();
  }

  randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  toggleViewDisplay() {
    this.isTileView = !this.isTileView;
  }

  resetSelectionPagination() {
    this.listviewComponent?.resetSelectionPagination();
  }

  loadProfileDetails(profile: Profile) {
    this.loadDetails.emit(profile);
  }

  openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }
}
