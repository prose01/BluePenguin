import { Component, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { Subscription } from 'rxjs';

import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { ViewFilterTypeEnum } from '../../models/viewFilterTypeEnum';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { OrderByType } from '../../models/enums';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'app-profile-listview',
  templateUrl: './profile-listview.component.html'
})

export class ProfileListviewComponent implements OnDestroy {
  private pageSize: number;
  private adGroup: number;
  public loading: boolean = false;

  private allowAssignment: boolean = false;

  public dataSource: MatTableDataSource<Profile>;
  private selection = new SelectionModel<Profile>(true, []);

  private subs: Subscription[] = [];
  private _profiles: any[];
  private currentUserSubject: CurrentUser;
  public noProfiles: boolean = false;

  @Input() set profiles(values: any[]) {
    this._profiles = values;
    this.updateProfiles();
  }
  get profiles(): any[] {
    return this._profiles;
  }

  @Input() length: number;
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Input() displayedColumns: string[];
  @Output() getNextData: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.pageSize = this.configurationLoader.getConfiguration().defaultPageSize;
    this.adGroup = this.configurationLoader.getConfiguration().adGroup;

    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );

    this.subs.push(
      this.selection.changed.subscribe(item => {
        this.allowAssignment = this.selection.selected.length > 0;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private updateProfiles(): void {
    //// Add random ad-tile. TODO: Set the ad row to full width.
    //for (let index = 0; index < this.profiles?.length; index++) {

    //  // Group list of Profiles by AdGroup.
    //  if (index != 0 && index % this.adGroup === 0){
    //    // Select random index within group and apply ad-tile.
    //    var i = this.randomIntFromInterval(index - this.adGroup, index);
    //    this.profiles?.splice(i, 0, 'ad');
    //  }
    //}

    this.profiles?.length <= 0 ? this.noProfiles = true : this.noProfiles = false;

    this.setDataSource();
  }

  private pageChanged(event): void {

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    this.getNextData.emit({ pageIndex: pageIndex, pageSize: pageSize });
  }

  private setDataSource(): void {
    this.dataSource = new MatTableDataSource<Profile>(this.profiles);
    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get sort working.
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  private isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  private masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() :this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  private checkboxLabel(row?: Profile): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.profileId}`;
  }

  /** Add or remove Likes */
  private toggleLikes(): void {

    var removeProfiles = new Array;
    var addProfiles = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {

      var profileId = this.selection.selected[_i].profileId;
      if (this.liked(this.selection.selected[_i])) {
        removeProfiles.push(profileId);
      }
      else {
        addProfiles.push(profileId);
      }
    }

    if (addProfiles.length > 0) {
      this.subs.push(
        this.profileService.addLikeToProfiles(addProfiles)
          .subscribe({
            next: () => {
              addProfiles.forEach((currentValue, i) => {
                this.profiles.find(x => x.profileId === currentValue).likes.push(this.currentUserSubject.profileId);
              });              
            },
            complete: () => {},
            error: () => {
              this.openErrorDialog(this.translocoService.translate('CouldNotAddLike'), null);
            }
          })
      );
    }

    if (removeProfiles.length > 0) {
      this.subs.push(
        this.profileService.removeLikeFromProfiles(removeProfiles)
        .subscribe({
          next: () => {
            removeProfiles.forEach((currentValue, i) => {
              var index = this.profiles.find(x => x.profileId === currentValue)?.likes.indexOf(this.currentUserSubject.profileId);
              if (index !== -1) {
                this.profiles.find(x => x.profileId === currentValue)?.likes.splice(index, 1);
              }
            });              
          },
          complete: () => {},
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotRemoveLike'), null);
          }
        })
      );
    }
  }

  /** Add or remove BookmarkedProfiles */
  private toggleBookmarkedProfiles(): void {

    var removeProfiles = new Array;
    var addProfiles = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {

      var profileId = this.selection.selected[_i].profileId;

      if (this.bookmarked(profileId)) {
        removeProfiles.push(profileId);
      }
      else {
        addProfiles.push(profileId);
      }
    }

    if (removeProfiles.length > 0) {
      this.subs.push(
        this.profileService.removeProfilesFromBookmarks(removeProfiles)
        .subscribe({
          next: () =>  {
            this.profileService.updateCurrentUserSubject();
            if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
          },
          complete: () => {},
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotRemoveBookmarkedProfiles'), null);
          }
        })
      );
    }

    if (addProfiles.length > 0) {
      this.subs.push(
        this.profileService.addProfilesToBookmarks(addProfiles)
        .subscribe({
          next: () =>  {
            this.profileService.updateCurrentUserSubject();
            if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
          },
          complete: () => {},
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotAddBookmarkedProfiles'), null);
          }
        })
      );
    }
  }

  private selcetedProfileIds(): string[] {
    let profileIds = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      profileIds.push(this.selection.selected[_i].profileId);
    }

    return profileIds;
  }

  resetSelectionPagination(): void {
    this.selection?.clear();
    if (this.paginator != null) {
      this.paginator.pageIndex = 0;
      this.paginator.pageSize = this.pageSize;
    }
  }

  private openDeleteProfilesDialog(): void {
    if (this.selcetedProfileIds().length > 0) {
      const dialogRef = this.dialog.open(DeleteProfileDialog, {
        data: this.selcetedProfileIds()
      });

      this.subs.push(
        dialogRef.afterClosed().subscribe(
          res => {
            if (res === true) {

              for (let profileId of this.selcetedProfileIds()) {
                let index = this.profiles.indexOf(this.profiles.find(x => x.profileId === profileId), 0);
                this.profiles.splice(index, 1);
              }
            }
          }
        )
      );
    }
  }

  // Load Detalails page
  private loadDetails(profile: Profile): void {
    this.loadProfileDetails.emit(profile);
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

    if (profile.images != null && profile.images.length > 0) {

      profile.images.forEach((element) => {

        if (typeof element.fileName !== 'undefined') {

          //// TODO: Remove this is-statement when all photos have format
          //if (!element.fileName.includes('.jpeg')) {
          //  element.fileName = element.fileName + '.jpeg'
          //}

          element.image = 'https://freetrail.blob.core.windows.net/photos/' + profile.profileId + '/' + element.fileName
        }

      });
    }
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

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
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
