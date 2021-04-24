import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { OrderByType } from '../../models/enums';
import { ViewFilterTypeEnum } from '../../models/viewFilterTypeEnum';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageService } from '../../services/image.service';
import { BehaviorSubject } from 'rxjs';
import { CurrentUser } from '../../models/currentUser';


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
  loading: boolean = true;
  throttle = 1;
  scrollDistance = 2;
  scrollUpDistance = 3;
  defaultImage = '../assets/default-person-icon.jpg';
  noProfiles: boolean = false;

  @Input() profiles: Profile[];
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Input() orderBy: OrderByType;
  @Output("getNextTileData") getNextTileData: EventEmitter<any> = new EventEmitter();
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private dialog: MatDialog) {
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

    this.getNextTileData.emit({ viewFilterType: this.viewFilterType, currentSize: currentSize, pageIndex: pageIndex.toString(), pageSize: this.pageSize.toString() });
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

  // Load Detalails page  // TODO: Tile and list view need to call this.
  loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  // Get Bookmarked Profiles.
  triggerBookmarkedProfiles() {
    this.getBookmarkedProfiles.emit();
  }

  /** Add or remove bookmarks */
  removeFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => { this.getBookmarkedProfiles.emit(); });
  }

  addFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { });
  }



  async openImageDialog(profile: Profile): Promise<void> {

    this.setImageTitles(profile);
    await this.getSmallProfileImages(profile);
    await this.getProfileImages(profile);

    this._smallImages.subscribe(x => {
      this.setSmallGalleryImages(x);
    });

    this._images.subscribe(x => {
      this.setGalleryImages(x);
    });

    setTimeout(() => {
      const dialogRef = this.dialog.open(ImageDialog, {
        //height: '80%',
        //width: '80%',
        data: {
          index: 0,
          smallimages: this.defaultImages,
          images: this.galleryImages,
          titles: this.imagesTitles
        }
      });

      dialogRef.afterClosed().subscribe(
        res => {
          if (res === true) { this.loadDetails(profile) }
        }
      );

    }, 5000); // TODO: Find something better

    //const dialogRef = this.dialog.open(ImageDialog, {
    //  //height: '80%',
    //  //width: '80%',
    //  data: {
    //    index: 0,
    //    images: this.smallImages // TODO: use defaultImage first, then galleryImage
    //    //titles: this.imagesTitles
    //  }
    //});
  }

  //smallImages: any[] = [];

  private _smallImages = new BehaviorSubject<any[]>([]);
  private _images = new BehaviorSubject<any[]>([]);

  set smallImages(value: any[]) {
    this._smallImages.next(value); 
  }

  set images(value: any[]) {
    this._images.next(value);
  }

  imagesTitles: string[] = [];
  galleryImages: any[] = [];
  defaultImages: any[] = [];

  getSmallProfileImages(profile: Profile): Promise<void> {
    this.imageService.getProfileImages(profile.profileId, ImageSizeEnum.small)
      .pipe(takeWhileAlive(this))
      .subscribe(smallImages => this.smallImages = smallImages);

    return Promise.resolve();
  }

  getProfileImages(profile: Profile): Promise<void> {
    this.imageService.getProfileImages(profile.profileId, ImageSizeEnum.large)
      .pipe(takeWhileAlive(this))
      .subscribe(images => this.images = images);

    return Promise.resolve();
  }

  setSmallGalleryImages(smallImages: any[]): void {
    const pics = [];
    smallImages.forEach(element => pics.push(
      'data:image/jpg;base64,' + element
    ));

    this.defaultImages = pics;
  }

  setGalleryImages(images: any[]): void {
    const pics = [];
    images.forEach(element => pics.push(
      'data:image/jpg;base64,' + element
    ));
    this.galleryImages = pics;
  }

  setImageTitles(profile: Profile): void {
    const imageTitles = [];
    profile.images.forEach(element => imageTitles.push(
      element.title
    ));

    this.imagesTitles = imageTitles;
  }
}
