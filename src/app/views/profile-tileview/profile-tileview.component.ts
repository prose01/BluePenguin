import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
//import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';

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
import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';

@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.scss']
})

//@AutoUnsubscribe()
export class ProfileTileviewComponent implements OnChanges {

  currentUserSubject: CurrentUser;
  selectedProfile: Profile;
  pageIndex: number = 0;
  pageSize: number;
  currentSize: number;
  throttle = 1;
  scrollDistance = 2;
  scrollUpDistance = 2;
  defaultImage = '../assets/default-person-icon.jpg';
  noProfiles: boolean = false;
  loading: boolean = false;

  currentProfiles: Profile[] = [];

  @Input() profiles: Profile[];
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Input() orderBy: OrderByType;
  @Output("getNextData") getNextData: EventEmitter<any> = new EventEmitter();
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  constructor(private profileService: ProfileService, private imageService: ImageService, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
    this.pageSize = this.configurationLoader.getConfiguration().defaultPageSize;
  }

  ngOnChanges(): void {
    // Remove empty profile from array.
    this.profiles = this.profiles?.filter(function (el) {
      return el != null;
    });

    this.currentProfiles.push(...this.profiles);
    //this.currentProfiles.splice(0, 5);

    //this.profiles?.length <= 0 ? this.noProfiles = true : this.noProfiles = false;
  }

  onScrollDown() {
    console.log('scrolled down!!');

    this.pageIndex++;
    this.currentSize = this.pageSize * this.pageIndex;

    console.log('pageIndex ' + this.pageIndex);
    console.log('pageSize ' + this.pageSize);
    console.log('currentSize ' + this.currentSize);
    console.log('profiles ' + this.profiles.length);
    console.log('currentProfiles ' + this.currentProfiles.length);

    if (this.profiles?.length > 0) {
      console.log('getting next');
      this.getNextData.emit({ currentSize: this.currentSize, pageIndex: this.pageIndex, pageSize: this.pageSize });
    }
  }

  onScrollUp() {
    console.log('scrolled up!!');

    this.pageIndex--;
    this.currentSize = this.pageSize * this.pageIndex;

    console.log('pageIndex ' + this.pageIndex);
    console.log('pageSize ' + this.pageSize);
    console.log('currentSize ' + this.currentSize);
    console.log('profiles ' + this.profiles.length);

    if (this.profiles?.length > 0) {
      console.log('getting next');
      //this.getNextData.emit({ currentSize: this.currentSize, pageIndex: this.pageIndex, pageSize: this.pageSize });
    }
  }

  // Load Detalails page
  loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  /** Add or remove bookmarks */
  addBookmarkedProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles)
      //.pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
        if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
      });
  }

  removeBookmarkedProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      //.pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
        if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
      });
  }

  /** Add or remove Likes */
  addLike(profile: Profile) {
    this.profileService.addLikeToProfile(profile.profileId)
      //.pipe(takeWhileAlive(this))
      .subscribe(() => {
        this.profiles.find(x => x.profileId === profile.profileId).likes.push(this.currentUserSubject.profileId);
      }, () => { }, () => { });
  }

  removeLike(profile: Profile) {
    this.profileService.removeLikeFromProfile(profile.profileId)
      //.pipe(takeWhileAlive(this))
      .subscribe(() => {
        let index = this.profiles.find(x => x.profileId === profile.profileId).likes.indexOf(this.currentUserSubject.profileId, 0);
        this.profiles.find(x => x.profileId === profile.profileId).likes.splice(index, 1);
      }, () => { }, () => { });
  }

  async openImageDialog(profile: Profile): Promise<void> {

    this.getProfileImages(profile);

    const dialogRef = this.dialog.open(ImageDialog, {
      data: {
        index: profile.imageNumber,
        imageModels: profile.images,
        profile: profile
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
              //.pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.smallimage = 'data:image/jpeg;base64,' + images.toString() },
                () => { this.loading = false; element.smallimage = defaultImageModel.smallimage },
                () => { this.loading = false; }
              );

            this.imageService.getProfileImageByFileName(profile.profileId, element.fileName, ImageSizeEnum.large)
              //.pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.image = 'data:image/jpeg;base64,' + images.toString() },
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
    return profile.likes?.find(x => x == this.currentUserSubject.profileId);
  }

  openDeleteProfilesDialog(profile: Profile): void {
    var profileIds: string[] = [profile.profileId];

    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      data: profileIds
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res === true) {
          let index = this.profiles.indexOf(this.profiles.find(x => x.profileId === profile.profileId), 0);
          this.profiles.splice(index, 1);
        }
      }
    );
  }
}
