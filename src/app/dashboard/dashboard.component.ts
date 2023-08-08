import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationLoader } from '../configuration/configuration-loader.service';
import { Subscription } from 'rxjs';

import { AuthService } from './../authorisation/auth/auth.service';
import { Profile } from '../models/profile';
import { ImageModel } from '../models/imageModel';
import { ProfileService } from '../services/profile.service';
import { OrderByType } from '../models/enums';
import { ViewFilterTypeEnum } from '../models/viewFilterTypeEnum';
import { ProfileListviewComponent } from '../views/profile-listview/profile-listview.component';
import { ProfileTileviewComponent } from '../views/profile-tileview/profile-tileview.component';
import { ProfileFilter } from '../models/profileFilter';
import { BehaviorSubjectService } from '../services/behaviorSubjec.service';
import { ErrorDialog } from '../error-dialog/error-dialog.component';
import { CurrentUser } from '../models/currentUser';
import { getBrowserLang, TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html'
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
  private pinacothecaUrl: string;

  private displayedColumns: string[] = ['select', 'name', 'lastActive', 'visit/book', 'favorites', 'likes', 'contactable']; // TODO: Add columns after user's choise or just default?

  public loading: boolean = false;
  public isTileView = true;
  public isProfileCreated = false;

  @Output("loadDetails") loadDetails: EventEmitter<any> = new EventEmitter();
  @Output("isCurrentUserCreated") isCurrentUserCreated: EventEmitter<any> = new EventEmitter();
  @Output("cleaningAndChecks") cleaningAndChecks: EventEmitter<any> = new EventEmitter();
  @Output("logOut") logOut: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService, private behaviorSubjectService: BehaviorSubjectService, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.pinacothecaUrl = this.configurationLoader.getConfiguration().pinacothecaUrl;
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
          this.isProfileCreated = true;
          this.isCurrentUserCreated.emit({ isCreated: true, languagecode: this.currentUserSubject.languagecode, uploadImageClick: false });
          this.cleaningAndChecks.emit();
        }

        this.getLatestProfiles();
      },
        (error: any) => {
          if (error.status === 0) {
            // A network error occurred.
            this.isProfileCreated = false;
            this.openErrorDialog(this.translocoService.translate('NoServerConnection'), null);
          }
          if (error.status === 404) {
            var user = this.auth.getAuth0Id().subscribe({
              next: () => {
                // User exist in Auth0 => create new user.
                this.isProfileCreated = false;
                this.isCurrentUserCreated.emit({ isCreated: false, languagecode: getBrowserLang(), uploadImageClick: false });
              },
              complete: () => { },
              error: () => {
              // User does not exist in Auth0 => just log out.
                this.logOut.emit();
              }
            })
          }
        }
      );

      // Get and load previous ProfileFilter.
      this.subs.push(
        this.behaviorSubjectService.currentProfileFilterSubject.subscribe(currentProfileFilterSubject => {
          this.filter = currentProfileFilterSubject;
        })
      );

    }
    else {
      // Just log out if not Authenticated.
      this.logOut.emit();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private getNextData(event: any): void {
    this.getData(this.viewFilterType, this.orderBy, event);
  }

  getData(viewFilterType: ViewFilterTypeEnum, orderBy: OrderByType, event: any): void {

    this.orderBy = orderBy;
    this.viewFilterType = viewFilterType;

    switch (viewFilterType) {
      case ViewFilterTypeEnum.LatestProfiles: {
        this.getLatestProfiles(orderBy, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.FilterProfiles: {
        this.getProfileByCurrentUsersFilter(orderBy, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.BookmarkedProfiles: {
        this.getBookmarkedProfiles(orderBy,  event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesSearch: {
        this.getProfileByFilter(this.filter, orderBy, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoVisitedMe: {
        this.getProfilesWhoVisitedMe(orderBy, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoBookmarkedMe: {
        this.getProfilesWhoBookmarkedMe(orderBy, event.pageIndex, event.pageSize);
        break;
      }
      case ViewFilterTypeEnum.ProfilesWhoLikesMe: {
        this.getProfilesWhoLikesMe(orderBy, event.pageIndex, event.pageSize);
        break;
      }
      default: {
        this.getLatestProfiles(orderBy, event.pageIndex, event.pageSize);
        break;
      }
    }
  }

  resetCurrentProfiles(): void {
    this.profileTileviewComponent?.resetCurrentProfiles();
  }

  // Get latest Profiles. 
  private getLatestProfiles(selectedOrderBy: OrderByType = OrderByType.LastActive, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getLatestProfiles(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response.profiles);

            this.length = response.total;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetLatestProfiles'), null); this.loading = false;
          }
        })
    );
  }

  // Get Filtered Profiles.
  private getProfileByCurrentUsersFilter(selectedOrderBy: OrderByType = OrderByType.LastActive, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfileByCurrentUsersFilter(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response.profiles);

            this.length = response.total;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfileByCurrentUsersFilter'), null); this.loading = false;
          }
        })
    );
  }

  // Get Bookmarked Profiles.
  private getBookmarkedProfiles(selectedOrderBy: OrderByType = OrderByType.LastActive, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getBookmarkedProfiles(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response.profiles);

            this.length = response.total;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetBookmarkedProfiles'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profiles by searchfilter.
  private getProfileByFilter(profileFilter: ProfileFilter, selectedOrderBy: OrderByType = OrderByType.LastActive, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfileByFilter(profileFilter, selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response.profiles);

            this.length = response.total;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfileByFilter'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profiles who has visited my profile.
  private getProfilesWhoVisitedMe(selectedOrderBy: OrderByType = OrderByType.LastActive, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfilesWhoVisitedMe(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response.profiles);

            this.length = response.total;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfilesWhoVisitedMe'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profiles who has visited my profile.
  private getProfilesWhoBookmarkedMe(selectedOrderBy: OrderByType = OrderByType.LastActive, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfilesWhoBookmarkedMe(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response.profiles);

            this.length = response.total;
          },
          complete: () => { this.getProfileImages(this.currentProfiles); },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetProfilesWhoBookmarkedMe'), null); this.loading = false;
          }
        })
    );
  }

  // Get Profiles who like my profile.
  private getProfilesWhoLikesMe(selectedOrderBy: OrderByType = OrderByType.LastActive, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getProfilesWhoLikesMe(selectedOrderBy, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response.profiles);

            this.length = response.total;
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

    profiles?.forEach((element) => {
      // Take a random image from profile.
      element.imageNumber = this.randomIntFromInterval(0, element.images.length - 1);

      if (element.images != null && element.images.length > 0 && typeof element.images[element.imageNumber].fileName !== 'undefined') {

        // TODO: Remove this is-statement when all photos have format
        if (!element.images[element.imageNumber].fileName.includes('.')) {
          element.images[element.imageNumber].fileName = element.images[element.imageNumber].fileName + '.jpeg'
        }

        element.images[element.imageNumber].image = 'https://freetrail.blob.core.windows.net/photos/' + element.profileId + '/large/' + element.images[element.imageNumber].fileName
        //element.images[element.imageNumber].smallimage = 'https://freetrail.blob.core.windows.net/photos/' + element.profileId + '/small/' + element.images[element.imageNumber].fileName
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
