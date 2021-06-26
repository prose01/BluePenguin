import { Component, OnChanges, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

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
  styleUrls: ['./profile-listview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

@AutoUnsubscribe()
export class ProfileListviewComponent implements OnChanges {
  pageEvent: PageEvent;
  datasource: null;
  pageIndex: number;
  pageSize: number;
  loading: boolean = false;

  dataSource: MatTableDataSource<Profile>;
  selection = new SelectionModel<Profile>(true, []);

  currentUserSubject: CurrentUser;
  noProfiles: boolean = false;

  @Input() profiles: Profile[];
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Input() displayedColumns: string[];
  @Input() orderBy: OrderByType;
  @Output() getNextData: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog) {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
  }

  ngOnChanges(): void {
    this.profiles = this.profiles?.filter(function (el) {
      return el != null;
    });

    this.profiles?.length <= 0 ? this.noProfiles = true : this.noProfiles = false;

    this.setDataSource();
  }

  pageChanged(event) {
    this.loading = true;

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let currentSize = pageSize * pageIndex;

    if (currentSize > 0) {
      this.getNextData.emit({ viewFilterType: this.viewFilterType, currentSize: currentSize, pageIndex: pageIndex.toString(), pageSize: pageSize.toString() });
    }
    else {
      this.loading = false;
    }
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.profiles);
    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get pagination & sort working.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length > 1 ? this.dataSource.data.length - 1 : this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Profile): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.profileId}`;
  }

  /** Add or remove bookmarks */
  addFavoritProfiles() {
    this.profileService.addProfilesToBookmarks(this.selcetedProfiles())
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
        if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
      });
  }

  removeFavoritProfiles() {
    this.profileService.removeProfilesFromBookmarks(this.selcetedProfiles())
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.updateCurrentUserSubject();
        if (this.viewFilterType == "BookmarkedProfiles") { this.getBookmarkedProfiles.emit(OrderByType.CreatedOn); }
      });
  }

  /** Add or remove Likes */
  toggleLike() {

    for (var _i = 0; _i < this.selection.selected.length; _i++) {

      var profileId = this.selection.selected[_i].profileId;

      // If profile has no likes yet. 
      if (this.selection.selected[_i].likes?.length == 0) {
        this.profileService.addLikeToProfile(this.selection.selected[_i].profileId)
          .pipe(takeWhileAlive(this))
          .subscribe(() => {
            this.profiles.find(x => x.profileId === profileId).likes.push(this.currentUserSubject.profileId);
          }, () => { }, () => { });
        return;
      }

      for (const value of this.selection.selected[_i].likes) {
        if (this.liked(this.selection.selected[_i])) {
          this.profileService.removeLikeFromProfile(this.selection.selected[_i].profileId)
            .pipe(takeWhileAlive(this))
            .subscribe(() => {
              const index = this.profiles.find(x => x.profileId === profileId).likes.indexOf(this.currentUserSubject.profileId, 0);
              this.profiles.find(x => x.profileId === profileId).likes.splice(index, 1);
            }, () => { }, () => { });
        }
        else {
          this.profileService.addLikeToProfile(this.selection.selected[_i].profileId)
            .pipe(takeWhileAlive(this))
            .subscribe(() => {
              this.profiles.find(x => x.profileId === profileId).likes.push(this.currentUserSubject.profileId);
            }, () => { }, () => { });
        }
      }
    }
  }

  selcetedProfiles(): string[] {
    let profiles = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      profiles.push(this.selection.selected[_i].profileId);
    }

    return profiles;
  }

  resetSelectionPagination() {
    this.selection.clear();
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = 5;
  }

  openDeleteProfilesDialog(): void {
    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      height: '300px',
      width: '300px',
      data: this.selcetedProfiles()
    });
  }

  // Load Detalails page
  loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  async openImageDialog(profile: Profile): Promise<void> {

    this.getProfileImages(profile);

    const dialogRef = this.dialog.open(ImageDialog, {
      data: {
        index: profile.imageNumber,
        imageModels: profile.images,
        profile: profile,
        currentUserSubjectProfileId: this.currentUserSubject.profileId
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
    return this.currentUserSubject.bookmarks.find(x => x == profileId);
  }

  liked(profile: Profile) {
    return profile.likes?.find(x => x == this.currentUserSubject.profileId);
  }
}
