import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { OrderByType } from '../../models/enums';
import { ViewFilterTypeEnum } from '../../models/viewFilterTypeEnum';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageService } from '../../services/image.service';
import { CurrentUser } from '../../models/currentUser';
import { ImageModel } from '../../models/imageModel';
import { Likes } from '../../models/likes';

@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.scss']
})

@AutoUnsubscribe()
export class ProfileTileviewComponent implements OnChanges {

  currentUserSubject: CurrentUser;
  selectedProfile: Profile;
  pageIndex: number;
  pageSize: number = 20;
  throttle = 1;
  scrollDistance = 2;
  scrollUpDistance = 3;
  defaultImage = '../assets/default-person-icon.jpg';
  noProfiles: boolean = false;
  loading: boolean = false;

  @Input() profiles: Profile[];
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Input() orderBy: OrderByType;
  @Output("getNextTileData") getNextTileData: EventEmitter<any> = new EventEmitter();
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  constructor(private profileService: ProfileService, private imageService: ImageService, private dialog: MatDialog) {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
  }


  ngOnChanges(): void {
    // Remove empty profile from array.
    this.profiles = this.profiles?.filter(function (el) {
      return el != null;
    });

    this.profiles?.length <= 0 ? this.noProfiles = true : this.noProfiles = false;
  }

  onScrollDown() {
    console.log('scrolled down!!');

    let pageIndex = 2; // TODO: auto count up ++
    let currentSize = this.pageSize * pageIndex;

    if (this.profiles?.length > 0) {
      console.log('getting next');
      this.getNextTileData.emit({ viewFilterType: this.viewFilterType, currentSize: currentSize, pageIndex: pageIndex.toString(), pageSize: this.pageSize.toString() });
    }
  }

  onScrollUp() {
    console.log('scrolled up!!');

    //this.getPreviousData.emit({ viewFilterType: this.viewFilterType, currentSize: currentSize, pageIndex: pageIndex.toString(), pageSize: this.pageSize.toString() });
  }

  //toggleDisplayOrder() {
  //  this.isMatButtonToggled = !this.isMatButtonToggled;
  //  this.matButtonToggleIcon = (this.isMatButtonToggled ? 'expand_less' : 'expand_more');

  //  switch (this.orderBy) {
  //    case OrderByType.UpdatedOn: {
  //      if (new Date(this.profiles[0].updatedOn) < new Date(this.profiles[this.profiles.length - 1].updatedOn)) {
  //        this.profiles.sort((a, b) => (new Date(a.updatedOn) < new Date(b.updatedOn)) ? 1 : -1);
  //      }
  //      else {
  //        this.profiles.sort((a, b) => (new Date(a.updatedOn) > new Date(b.updatedOn)) ? 1 : -1);
  //      }
  //      break;
  //    }
  //    case OrderByType.LastActive: {
  //      if (new Date(this.profiles[0].lastActive) < new Date(this.profiles[this.profiles.length - 1].lastActive)) {
  //        this.profiles.sort((a, b) => (new Date(a.lastActive) < new Date(b.lastActive)) ? 1 : -1);
  //      }
  //      else {
  //        this.profiles.sort((a, b) => (new Date(a.lastActive) > new Date(b.lastActive)) ? 1 : -1);
  //      }
  //      break;
  //    }
  //    default: {
  //      if (new Date(this.profiles[0].createdOn) < new Date(this.profiles[this.profiles.length - 1].createdOn)) {
  //        this.profiles.sort((a, b) => (new Date(a.createdOn) < new Date(b.createdOn)) ? 1 : -1);
  //      }
  //      else {
  //        this.profiles.sort((a, b) => (new Date(a.createdOn) > new Date(b.createdOn)) ? 1 : -1);
  //      }
  //      break;
  //    }
  //  }
  //}

  // Load Detalails page
  loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  /** Add or remove bookmarks */
  addFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
        if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
      });
  }

  removeFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
        if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
      });
  }

  /** Add or remove Likes */
  addLike(profile: Profile) {
    this.profileService.addLikeToProfile(profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(() => {
        this.profiles.find(x => x.profileId === profile.profileId).likes[this.currentUserSubject.profileId] = new Date();
      }, () => { }, () => { });
  }

  removeLike(profile: Profile) {
    this.profileService.removeLikeFromProfile(profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(() => {
        delete this.profiles.find(x => x.profileId === profile.profileId).likes[this.currentUserSubject.profileId];
      }, () => { }, () => { });
  }

  async openImageDialog(profile: Profile): Promise<void> {

    this.getProfileImages(profile);

    const dialogRef = this.dialog.open(ImageDialog, {
      data: {
        index: profile.imageNumber,
        imageModels: profile.images
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res === true) { this.loadDetails(profile) }
      }
    );
  }

  getProfileImages(profile: Profile): void {
    let defaultImageModel: ImageModel = new ImageModel();

    if (profile.images != null && profile.images.length > 0) {
      if (profile.images.length > 0) {

        profile.images.forEach((element, i) => {

          if (typeof element.fileName !== 'undefined') {

            this.loading = true;

            this.imageService.getProfileImageByFileName(profile.profileId, element.fileName, ImageSizeEnum.small)
              .pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.smallimage = 'data:image/png;base64,' + images.toString() },
                () => { this.loading = false; element.smallimage = defaultImageModel.smallimage },
                () => { this.loading = false; }
              );

            this.imageService.getProfileImageByFileName(profile.profileId, element.fileName, ImageSizeEnum.large)
              .pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.image = 'data:image/png;base64,' + images.toString() },
                () => { this.loading = false; element.image = defaultImageModel.image },
                () => { this.loading = false; }
              );
          }

        });
      }
    }
  }

  bookmarked(profileId: string) {
    return this.currentUserSubject?.bookmarks.find(x => x == profileId);
  }

  liked(profile: Profile) {
    for (const [key, value] of Object.entries(profile.likes)) {
      //console.log(Object.entries(profile.likes).length);
      if (key === this.currentUserSubject.profileId) {
        return true;
      }
    }

    return false;
  }
}
