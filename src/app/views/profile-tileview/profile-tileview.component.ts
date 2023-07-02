import { Component, Input, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { Subscription } from 'rxjs';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { ViewFilterTypeEnum } from '../../models/viewFilterTypeEnum';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { ImageService } from '../../services/image.service';
import { CurrentUser } from '../../models/currentUser';
import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html'
})

export class ProfileTileviewComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private _profiles: any[];
  private currentUserSubject: CurrentUser;
  private pageIndex: number = 0;
  private pageSize: number;
  private currentSize: number;
  public throttle = 1;
  public scrollDistance = 2;
  public scrollUpDistance = 2;
  public noProfiles: boolean = false;
  public loading: boolean = false;

  public currentProfiles: any[] = [];
  private imageSize: string[] = []
  private randomImagePlace: number;
  private adGroup: number;
  private imageMaxWidth: number;
  private imageMaxHeight: number;

  @Input() set profiles(values: any[]) {
    this._profiles = values;
    this.updateProfiles();
  }
  get profiles(): any[] {
    return this._profiles;
  }


  @Input() viewFilterType: ViewFilterTypeEnum;
  @Output("getNextData") getNextData: EventEmitter<any> = new EventEmitter();
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  constructor(private profileService: ProfileService, private imageService: ImageService, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.pageSize = this.configurationLoader.getConfiguration().defaultPageSize;
    this.randomImagePlace = this.configurationLoader.getConfiguration().randomImagePlace;
    this.adGroup = this.configurationLoader.getConfiguration().adGroup;
    this.imageMaxWidth = this.configurationLoader.getConfiguration().imageMaxWidth;
    this.imageMaxHeight = this.configurationLoader.getConfiguration().imageMaxHeight;
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

  private updateProfiles(): void {

    // Add random ad-tile.
    for (let index = 0; index < this.profiles?.length; index++) {

      // Group list of Profiles by AdGroup.
      if (index != 0 && index % this.adGroup === 0) {
        // Select random index within group and apply ad-tile.
        var i = this.randomIntFromInterval(index - this.adGroup, index);
        this.profiles?.splice(i, 0, 'ad');
      }
    }

    // Set random image size.
    for (var i = 0, len = this.profiles?.length; i < len; i++) {
      this.imageSize.push(this.randomSize());
    }

    // In case we only have small images set at leas one.
    if (this.profiles?.length > 0 && !this.imageSize.includes('big')) {
      this.imageSize[this.randomImagePlace] = 'big'
    }

    if (this.profiles?.length > 0) {
      this.currentProfiles.push(...this.profiles);
    }

    this.profiles?.length <= 0 ? this.noProfiles = true : this.noProfiles = false;
  }

  async resetCurrentProfiles(): Promise<void> {
    this.profiles = new Array;
    this.currentProfiles = new Array;
  }

  onScrollDown(): void {
    this.pageIndex++;
    this.currentSize = this.pageSize * this.pageIndex;

    if (this.profiles?.length > 0) {
      this.getNextData.emit({ currentSize: this.currentSize, pageIndex: this.pageIndex, pageSize: this.pageSize });
    }
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
        },
        complete: () => {},
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotAddBookmarkedProfiles'), null);
        }
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
          if (this.viewFilterType == "BookmarkedProfiles") {
            let index = this.currentProfiles.indexOf(this.profiles.find(x => x.profileId === profileId), 0);
            this.currentProfiles.splice(index, 1);
          }
        },
        complete: () => {},
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotRemoveBookmarkedProfiles'), null);
        }
      })
    );
  }

  /** Add or remove Likes */
  private addLike(profileId: string): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.subs.push(
      this.profileService.addLikeToProfiles(selcetedProfiles)
      .subscribe({
        next: () =>  {
          this.profiles.find(x => x.profileId === profileId).likes.push(this.currentUserSubject.profileId);
        },
        complete: () => {},
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotAddLike'), null);
        }
      })
    );
  }

  private removeLike(profileId: string): void {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.subs.push(
      this.profileService.removeLikeFromProfiles(selcetedProfiles)
      .subscribe({
        next: () =>  {
          let index = this.profiles.find(x => x.profileId === profileId).likes.indexOf(this.currentUserSubject.profileId, 0);
          this.profiles.find(x => x.profileId === profileId).likes.splice(index, 1);
        },
        complete: () => {},
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotRemoveLike'), null);
        }
      })
    );
  }

  private async openImageDialog(profile: Profile): Promise<void> {

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

  private bookmarked(profileId: string): boolean {
    if (this.currentUserSubject.bookmarks.indexOf(profileId) !== -1) {
      return true;
    }

    return false;
  }

  private liked(profile: Profile): boolean {
    if (profile?.likes?.indexOf(this.currentUserSubject.profileId) !== -1) {
      return true;
    }

    return false;
  }

  // Set random tilesize for images.
  private randomSize(): string {
    var randomInt = this.randomIntFromInterval(1, this.randomImagePlace);

    if (randomInt === 1) {
      return 'big';
    }

    return 'small';
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

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }
}
