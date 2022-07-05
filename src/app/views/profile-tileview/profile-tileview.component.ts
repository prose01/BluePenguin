import { Component, Input, EventEmitter, Output, OnChanges, OnInit, OnDestroy } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { Subscription } from 'rxjs';

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

export class ProfileTileviewComponent implements OnInit, OnChanges, OnDestroy {

  private subs: Subscription[] = [];
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

  currentProfiles: any[] = [];
  imageSize: string[] = []
  randomImagePlace: number;
  randomAdPlace: number;

  @Input() profiles: any[];
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Output("getNextData") getNextData: EventEmitter<any> = new EventEmitter();
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  constructor(private profileService: ProfileService, private imageService: ImageService, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.pageSize = this.configurationLoader.getConfiguration().defaultPageSize;
    this.randomImagePlace = this.configurationLoader.getConfiguration().randomImagePlace;
    this.randomAdPlace = this.configurationLoader.getConfiguration().randomAdPlace;
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );
    this.profiles = new Array;
    this.currentProfiles = new Array;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  ngOnChanges(): void {
    // Remove empty profile from array.
    this.profiles = this.profiles?.filter(function (el) {
      return el != null;
    });
    
    // Add random ad-tile
    this.profiles?.splice(this.randomAdTile(), 0, "ad");

    // Set random image size.
    for (var i = 0, len = this.profiles?.length; i < len; i++) {
      this.imageSize.push(this.randomSize());
    }

    // In case we only have small images set at leas one.
    if (!this.imageSize.includes('big')){
      this.imageSize[this.randomImagePlace] = 'big'
      console.log('No bigsss');
    }

    if (this.profiles?.length > 0) {
      this.currentProfiles.push(...this.profiles);
    }

    // this.currentProfiles.splice(this.randomAdTile(), 0, "ad");
    //this.currentProfiles.splice(0, 5);

    //this.profiles?.length <= 0 ? this.noProfiles = true : this.noProfiles = false;
  }

  async resetCurrentProfiles(): Promise<void> {
    this.profiles = new Array;
    this.currentProfiles = new Array;
  }

  onScrollDown(): void {
    console.log('scrolled down!!');

    this.pageIndex++;
    this.currentSize = this.pageSize * this.pageIndex;

    //console.log('pageIndex ' + this.pageIndex);
    //console.log('pageSize ' + this.pageSize);
    //console.log('currentSize ' + this.currentSize);
    //console.log('profiles ' + this.profiles.length);
    //console.log('currentProfiles ' + this.currentProfiles.length);

    if (this.profiles?.length > 0) {
      //console.log('getting next');
      this.getNextData.emit({ currentSize: this.currentSize, pageIndex: this.pageIndex, pageSize: this.pageSize });
    }
  }

  onScrollUp(): void {
    console.log('scrolled up!!');

    //this.pageIndex--;
    //this.currentSize = this.pageSize * this.pageIndex;

    ////console.log('pageIndex ' + this.pageIndex);
    ////console.log('pageSize ' + this.pageSize);
    ////console.log('currentSize ' + this.currentSize);
    ////console.log('profiles ' + this.profiles.length);

    //if (this.profiles?.length > 0) {
    //  //console.log('getting next');
    //  //this.getNextData.emit({ currentSize: this.currentSize, pageIndex: this.pageIndex, pageSize: this.pageSize });
    //}
  }

  // Load Detalails page
  private loadDetails(profile: Profile): void {
    this.loadProfileDetails.emit(profile);
  }

  /** Add or remove bookmarks */
  private addBookmarkedProfiles(profileId: string): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.subs.push(
      this.profileService.addProfilesToBookmarks(selcetedProfiles)
      .subscribe({
        next: () =>  {
          this.profileService.updateCurrentUserSubject();
          // if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
        },
        complete: () => {},
        error: () => {}
      })
    );
  }

  private removeBookmarkedProfiles(profileId: string): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.subs.push(
      this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      .subscribe({
        next: () =>  {
          this.profileService.updateCurrentUserSubject();
          // if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
          let index = this.currentProfiles.indexOf(this.profiles.find(x => x.profileId === profileId), 0);
          this.currentProfiles.splice(index, 1);
        },
        complete: () => {},
        error: () => {}
      })
    );
  }

  /** Add or remove Likes */
  private addLike(profile: Profile): void {
    this.subs.push(
      this.profileService.addLikeToProfile(profile.profileId)
      .subscribe({
        next: () =>  {
          this.profiles.find(x => x.profileId === profile.profileId).likes.push(this.currentUserSubject.profileId);
        },
        complete: () => {},
        error: () => {}
      })
    );
  }

  private removeLike(profile: Profile): void {
    this.subs.push(
      this.profileService.removeLikeFromProfile(profile.profileId)
      .subscribe({
        next: () =>  {
          let index = this.profiles.find(x => x.profileId === profile.profileId).likes.indexOf(this.currentUserSubject.profileId, 0);
          this.profiles.find(x => x.profileId === profile.profileId).likes.splice(index, 1);
        },
        complete: () => {},
        error: () => {}
      })
    );
  }

  private async openImageDialog(profile: Profile): Promise<void> {

    this.getProfileImages(profile);

    const dialogRef = this.dialog.open(ImageDialog, {
      data: {
        index: profile.imageNumber,
        imageModels: profile.images,
        profile: profile
      }
    });

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res === true) { this.loadDetails(profile) }
        }
      )
    );
  }

  private getProfileImages(profile: Profile): void {
    let defaultImageModel: ImageModel = new ImageModel();

    if (profile.images != null && profile.images.length > 0) {
      if (profile.images.length > 0) {

        profile.images.forEach((element, i) => {

          if (typeof element.fileName !== 'undefined') {

            this.loading = true;

            this.subs.push(
              this.imageService.getProfileImageByFileName(profile.profileId, element.fileName, ImageSizeEnum.small)
              .subscribe({
                next: (images: any[]) =>  { element.smallimage = 'data:image/jpeg;base64,' + images.toString() },
                complete: () => { this.loading = false; },
                error: () => { this.loading = false; element.smallimage = defaultImageModel.smallimage }
              })
            );

            this.subs.push(
              this.imageService.getProfileImageByFileName(profile.profileId, element.fileName, ImageSizeEnum.large)
              .subscribe({
                next: (images: any[]) =>  { element.image = 'data:image/jpeg;base64,' + images.toString() },
                complete: () => { this.loading = false; },
                error: () => { this.loading = false; element.image = defaultImageModel.image }
              })
            );
          }

        });
      }
    }
  }

  private bookmarked(profileId: string): string {
    return this.currentUserSubject?.bookmarks.find(x => x == profileId);
  }

  private liked(profile: Profile): string {
    return profile.likes?.find(x => x == this.currentUserSubject.profileId);
  }

  // Set random tilesize for images.
  private randomSize(): string {
    var randomInt = this.randomIntFromInterval(1, this.randomImagePlace);

    if (randomInt === 1) {
      return 'big';
    }

    return 'small';
  }

  // Set ad-tile at random.
  private randomAdTile(): number {
    return this.randomIntFromInterval(1, this.randomAdPlace);
  }

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private openDeleteProfilesDialog(profile: Profile): void {
    var profileIds: string[] = [profile.profileId];

    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      data: profileIds
    });

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res === true) {
            let index = this.profiles.indexOf(this.profiles.find(x => x.profileId === profile.profileId), 0);
            this.profiles.splice(index, 1);
          }
        }
      )
    );
  }
}
