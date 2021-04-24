import { Component, OnChanges, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { BehaviorSubject } from 'rxjs';

import { AuthService } from '../../authorisation/auth/auth.service';

import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { ViewFilterTypeEnum } from '../../models/viewFilterTypeEnum';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';

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
  loading: boolean = true;

  dataSource: MatTableDataSource<Profile>;
  selection = new SelectionModel<Profile>(true, []);

  currentUserSubject: CurrentUser;

  @Input() profiles: Profile[];
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Input() displayedColumns: string[];
  @Output() getNextData: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog) {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
  }

  ngOnChanges(): void {
    if (this.auth.isAuthenticated()) {
      this.setDataSource();
    }
  }

  pageChanged(event) {
    this.loading = true;

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let currentSize = pageSize * pageIndex;

    this.getNextData.emit({ viewFilterType: this.viewFilterType, currentSize: currentSize, pageIndex: pageIndex.toString(), pageSize: pageSize.toString()});
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
    const numRows = this.dataSource.data.length - 1;
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
  removeFavoritProfiles() {
    let profileIds = this.selcetedProfiles();

    this.profileService.removeProfilesFromBookmarks(profileIds)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.removeFavoritFromProfileslist(profileIds);
    });
  }

  removeFavoritFromProfileslist(profileIds: string[]) {
    let profiles = this.profiles;
    profileIds.forEach(function (value) {
      let pos = profiles.findIndex(i => i?.profileId === value);
      
      if (pos > -1) {
        profiles.splice(pos, 1);
      }
    });

    this.profiles = profiles;
    this.setDataSource(); // TODO: Find på noget bedre end at gøre dette igen
  }

  addFavoritProfiles() {
    this.profileService.addProfilesToBookmarks(this.selcetedProfiles())
      .pipe(takeWhileAlive(this))
      .subscribe(() => { });
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
