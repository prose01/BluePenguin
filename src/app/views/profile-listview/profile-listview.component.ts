import { Component, OnChanges, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter, OnDestroy } from '@angular/core';
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
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { ImageModel } from '../../models/imageModel';
import { OrderByType } from '../../models/enums';

@Component({
  selector: 'app-profile-listview',
  templateUrl: './profile-listview.component.html',
  styleUrls: ['./profile-listview.component.scss']
})

export class ProfileListviewComponent implements OnChanges, OnDestroy {
  private pageSize: number;
  private adGroup: number;
  public loading: boolean = false;

  private allowAssignment: boolean = false;

  public dataSource: MatTableDataSource<Profile>;
  private selection = new SelectionModel<Profile>(true, []);

  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;
  public noProfiles: boolean = false;

  @Input() profiles: any[];
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

  ngOnChanges(): void {
    this.profiles = this.profiles?.filter(function (el) {
      return el != null;
    });

    //// Add random ad-tile. TODO: Set the ad row to full width.
    //for (let index = 0; index < this.profiles?.length; index++) {

    //  // Group list of Profiles by AdGroup.
    //  if (index != 0 && index % this.adGroup === 0){
    //    // Select random index within group and apply ad-tile.
    //    var i = this.randomIntFromInterval(index - this.adGroup, index);
    //    this.profiles?.splice(i, 0, 'ad');
    //  }
    //}

    //this.profiles?.length <= 0 ? this.noProfiles = true : this.noProfiles = false;

    this.setDataSource();
  }

  private pageChanged(event): void {

    //// Not sure where this goes. Maybe it doesn't belogs here at all as pageChanged might not be called at first. Initial data call.
    //if (event.pageIndex = 0) {
    //  presentData -> this.getNextData.emit();
    //  futureData -> this.getNextData.emit();
    //}

    //if (this.pageIndex > event.pageIndex) {
    //  // We are going forward
    //  presentData -> pastData;
    //  futureData -> presentData;
    //  futureData -> this.getNextData.emit();
    //}
    //else if (this.pageIndex < event.pageIndex) {
    //  // We are going back
    //  presentData -> futureData;
    //  pastData -> presentData;
    //  pastData -> this.getNextData.emit();
    //}

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let currentSize = pageSize * pageIndex;

    //console.log('pageIndex ' + pageIndex);
    //console.log('pageSize ' + pageSize);
    //console.log('currentSize ' + currentSize);
    //console.log('profiles ' + this.profiles.length);

    this.getNextData.emit({ currentSize: currentSize, pageIndex: pageIndex, pageSize: pageSize });
  }

  private setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.profiles);
    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get sort working.
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  private isAllSelected(): boolean {
    //const numSelected = this.selection.selected.length;
    //const numRows = this.dataSource.data.length > 1 ? this.dataSource.data.length - 1 : this.dataSource.data.length;
    //return numSelected === numRows;
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  private masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  private checkboxLabel(row?: Profile): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.profileId}`;
  }

  /** Add or remove Likes */
  private toggleLike(): void {    // TODO: Look at these two toggles again and decide which to keep.

    for (var _i = 0; _i < this.selection.selected.length; _i++) {

      var profileId = this.selection.selected[_i].profileId;

      // If profile has no likes yet. 
      if (this.selection.selected[_i].likes?.length == 0) {
        this.subs.push(
          this.profileService.addLikeToProfile(this.selection.selected[_i].profileId)
          .subscribe({
            next: () =>  {
              this.profiles.find(x => x.profileId === profileId).likes.push(this.currentUserSubject.profileId);
            },
            complete: () => {},
            error: () => {}
          })
        );
        return;
      }

      for (const value of this.selection.selected[_i].likes) {
        if (this.liked(this.selection.selected[_i])) {
          this.subs.push(
            this.profileService.removeLikeFromProfile(this.selection.selected[_i].profileId)
            .subscribe({
              next: () =>  {
                const index = this.profiles.find(x => x.profileId === profileId)?.likes.indexOf(this.currentUserSubject.profileId, 0);
                this.profiles.find(x => x.profileId === profileId)?.likes.splice(index, 1);
              },
              complete: () => {},
              error: () => {}
            })
          );
        }
        else {
          this.subs.push(
            this.profileService.addLikeToProfile(this.selection.selected[_i].profileId)
            .subscribe({
              next: () =>  {
                this.profiles.find(x => x.profileId === profileId).likes.push(this.currentUserSubject.profileId);
              },
              complete: () => {},
              error: () => {}
            })
          );
        }
      }
    }
  }

  private toggleLike2(): void {   // TODO: Look at these two toggles again and decide which to keep.

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

    if (removeProfiles.length > 0) {
      this.subs.push(
        this.profileService.addLikeToProfile(profileId)
        .subscribe({
          next: () =>  {
            this.profiles.find(x => x.profileId === profileId).likes.push(this.currentUserSubject.profileId);
          },
          complete: () => {},
          error: () => {}
        })
      );
    }

    if (addProfiles.length > 0) {
      this.subs.push(
        this.profileService.addLikeToProfile(profileId)
        .subscribe({
          next: () =>  {
            this.profiles.find(x => x.profileId === profileId).likes.push(this.currentUserSubject.profileId);
          },
          complete: () => {},
          error: () => {}
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
          error: () => {}
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
          error: () => {}
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
                this.ngOnChanges();
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
    let defaultImageModel: ImageModel = new ImageModel();

    if (profile.images != null && profile.images.length > 0) {

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

  private bookmarked(profileId: string): string {
    return this.currentUserSubject.bookmarks.find(x => x == profileId);
  }

  private liked(profile: Profile): string {
    return profile.likes?.find(x => x == this.currentUserSubject.profileId);
  }

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
