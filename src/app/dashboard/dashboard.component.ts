import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationLoader } from '../configuration/configuration-loader.service';
import { Subscription } from 'rxjs';

import { AuthService } from './../authorisation/auth/auth.service';
import { Profile } from '../models/profile';
import { ImageModel } from '../models/imageModel';
import { ProfileService } from '../services/profile.service';
import { ImageService } from '../services/image.service';
import { OrderByType } from '../models/enums';
import { ImageSizeEnum } from '../models/imageSizeEnum';
import { ViewFilterTypeEnum } from '../models/viewFilterTypeEnum';
import { ProfileListviewComponent } from '../views/profile-listview/profile-listview.component';
import { ProfileTileviewComponent } from '../views/profile-tileview/profile-tileview.component';
import { ProfileFilter } from '../models/profileFilter';
import { BehaviorSubjectService } from '../services/behaviorSubjec.service';
import { ErrorDialog } from '../error-dialog/error-dialog.component';
import { CurrentUser } from '../models/currentUser';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChild(ProfileListviewComponent) listviewComponent: ProfileListviewComponent;
  @ViewChild(ProfileTileviewComponent) profileTileviewComponent: ProfileTileviewComponent;

  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;

  private length: number;

  private orderBy: OrderByType = OrderByType.LastActive;
  private viewFilterType: ViewFilterTypeEnum = ViewFilterTypeEnum.LatestProfiles;

  private previousProfiles: Profile[];
  private currentProfiles: Profile[];
  private nextProfiles: Profile[];
  private filter: ProfileFilter = new ProfileFilter();

  private defaultPageSize: number;

  private displayedColumns: string[] = ['select', 'name', 'lastActive', 'visit/book', 'favorites', 'likes', 'contactable']; // TODO: Add columns after user's choise or just default?

  public loading: boolean = false;
  public isTileView = true;

  //private intervalId: any;

  @Output("loadDetails") loadDetails: EventEmitter<any> = new EventEmitter();
  @Output("isCurrentUserCreated") isCurrentUserCreated: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private behaviorSubjectService: BehaviorSubjectService, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.defaultPageSize = this.configurationLoader.getConfiguration().defaultPageSize;
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        this.subs.push(
          this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; })
        );

        // Check if user allready exist. Name is mandatory.
        if (this.currentUserSubject?.name != null) {
          this.isCurrentUserCreated.emit({ isCreated: true, languagecode: this.currentUserSubject.languagecode, uploadImageClick: false });
        }

        this.getLatestProfiles();
      },
        (error: any) => {
          if (error.status === 0) {
            // A network error occurred.
            this.openErrorDialog(this.translocoService.translate('NoServerConnection'), null);
          }
        }
      );

      // Get and load previous ProfileFilter.
      this.subs.push(
        this.behaviorSubjectService.currentProfileFilterSubject.subscribe(currentProfileFilterSubject => {
          this.filter = currentProfileFilterSubject;
        })
      );

      //this.myCallback('first');
      //this.intervalId = setInterval(() => {
      //  this.myCallback('second');
      //}, 5 * 1000);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
    //clearInterval(this.intervalId);
  }

  //private myCallback(val: any): void {
  //  console.log('Authenticated ' + val);
  //}

  private getNextData(event: any): void {
    this.getData(this.viewFilterType, this.orderBy, event);
  }

  getData(viewFilterType: ViewFilterTypeEnum, orderBy: OrderByType, event: any): void {

    this.orderBy = orderBy;
    this.viewFilterType = viewFilterType;

    switch (viewFilterType) {
      case ViewFilterTypeEnum.LatestProfiles: {
        this.getLatestProfiles(orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.FilterProfiles: {
        this.getProfileByCurrentUsersFilter(orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.BookmarkedProfiles: {
        this.getBookmarkedProfiles(orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesSearch: {
        this.getProfileByFilter(this.filter, orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoVisitedMe: {
        this.getProfilesWhoVisitedMe(orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoBookmarkedMe: {
        this.getProfilesWhoBookmarkedMe(orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoLikesMe: {
        this.getProfilesWhoLikesMe(orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
      default: {
        this.getLatestProfiles(orderBy, event.currentSize, event.pageIndex, event.pageSize);
        break;
      }
    }
  }

  resetCurrentProfiles(): void {
    this.profileTileviewComponent?.resetCurrentProfiles();
  }

  // Get latest Profiles. 
  private getLatestProfiles(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getLatestProfiles(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response);

            this.length = this.currentProfiles.length + currentSize + 1;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetLatestProfiles'), null); this.loading = false;
          }
        })
    );
  }

  // Get Filtered Profiles.
  private getProfileByCurrentUsersFilter(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfileByCurrentUsersFilter(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response);

            this.length = this.currentProfiles.length + currentSize + 1;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfileByCurrentUsersFilter'), null); this.loading = false;
          }
        })
    );
  }

  // Get Bookmarked Profiles.
  private getBookmarkedProfiles(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getBookmarkedProfiles(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response);

            this.length = this.currentProfiles.length + currentSize + 1;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetBookmarkedProfiles'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profiles by searchfilter. 
  private getProfileByFilter(profileFilter: ProfileFilter, selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfileByFilter(profileFilter, selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response);

            this.length = this.currentProfiles.length + currentSize + 1;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfileByFilter'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profiles who has visited my profile.
  private getProfilesWhoVisitedMe(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfilesWhoVisitedMe(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response);

            this.length = this.currentProfiles.length + currentSize + 1;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfilesWhoVisitedMe'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profiles who has visited my profile.
  private getProfilesWhoBookmarkedMe(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfilesWhoBookmarkedMe(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response);

            this.length = this.currentProfiles.length + currentSize + 1;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfilesWhoBookmarkedMe'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profiles who like my profile.
  private getProfilesWhoLikesMe(selectedOrderBy: OrderByType = OrderByType.LastActive, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfilesWhoLikesMe(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response);

            this.length = this.currentProfiles.length + currentSize + 1;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfilesWhoLikesMe'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profile Images.
  private getProfileImages(profiles: Profile[]): Promise<void> {

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

        this.subs.push(
          this.imageService.getProfileImageByFileName(element.profileId, element.images[element.imageNumber].fileName, ImageSizeEnum.small)
            .subscribe({
              next: (images: any[]) => { element.images[element.imageNumber].smallimage = 'data:image/jpeg;base64,' + images.toString() },
              complete: () => { this.loading = false; },
              error: () => { this.loading = false; element.images[element.imageNumber].smallimage = defaultImageModel.smallimage }
            })
        );

        this.subs.push(
          this.imageService.getProfileImageByFileName(element.profileId, element.images[element.imageNumber].fileName, ImageSizeEnum.large)
            .subscribe({
              next: (images: any[]) => { element.images[element.imageNumber].image = 'data:image/jpeg;base64,' + images.toString() },
              complete: () => { this.loading = false; },
              error: () => { this.loading = false; element.images[element.imageNumber].image = defaultImageModel.image }
            })
        );
      }
      else {
        // Set default profile image.
        element.images[0] = defaultImageModel;
      }
    });

    return Promise.resolve();
  }

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  toggleViewDisplay(): void {
    this.isTileView = !this.isTileView;
  }

  resetSelectionPagination(): void {
    this.listviewComponent?.resetSelectionPagination();
  }

  private loadProfileDetails(profile: Profile): void {
    this.loadDetails.emit(profile);
  }

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }
}
