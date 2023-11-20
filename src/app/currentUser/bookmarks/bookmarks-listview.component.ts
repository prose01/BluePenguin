import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { Subscription } from 'rxjs';

import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { Bookmark } from '../../models/bookmark';
import { ProfileService } from '../../services/profile.service';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'bookmarks-listview',
  templateUrl: './bookmarks-listview.component.html'
})

export class BookmarksListviewComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];

  private pinacothecaUrl: string;

  private currentUserSubject: CurrentUser;
  private bookmarks: Bookmark[];

  private showBlocked: boolean = false;
  private matButtonToggleText: string;
  private matButtonToggleIcon: string = 'shield';

  private displayedColumns: string[] = ['select', 'avatar', 'name', 'status'];
  private selection = new SelectionModel<Bookmark>(true, []);
  public dataSource: MatTableDataSource<Bookmark>;

  public loading: boolean = true;

  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private cdr: ChangeDetectorRef, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.pinacothecaUrl = this.configurationLoader.getConfiguration().pinacothecaUrl;
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject
        .subscribe(currentUserSubject => {
          this.currentUserSubject = currentUserSubject; this.refreshBookmarks(false);
        })
    );

    this.subs.push(
      this.translocoService.selectTranslate('BookmarksListviewComponent.ShowBlocked').subscribe(value => this.matButtonToggleText = value)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private updateCurrentUserSubject() {
    this.profileService.updateCurrentUserSubject().then(res => { this.refreshBookmarks(true); this.toggleBlocked(); });
  }

  private setDataSource(): void {
    this.loading = false;
    this.dataSource = new MatTableDataSource<Bookmark>(this.bookmarks);

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'avatar.initials': return item.avatar.initials;
        default: return item[property];
      }
    };

    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get pagination & sort working.
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  private isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  private masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  private checkboxLabel(row?: Bookmark): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.profileId}`;
  }

  private blockBookmarks(): void {
    this.subs.push(
      this.profileService.blockBookmarks(this.selcetedProfileIds())
      .subscribe({
        next: () =>  {},
        complete: () => {
          this.updateCurrentUserSubject() 
        },
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotBlockBookmark'), null);
        }
      })
    );
  }

  private selcetedProfileIds(): string[] {
    let profileIds = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      profileIds.push(this.selection.selected[_i].profileId);
    }

    return profileIds;
  }

  private refreshBookmarks(showBlocked: boolean): void {
    let bookmarks = new Array;
    if (this.currentUserSubject != null) {
      if (this.currentUserSubject.bookmarks.length > 0) {
        this.currentUserSubject.bookmarks.forEach(function (member) {
          if (showBlocked == member.blocked && member.isBookmarked) {
            bookmarks.push(member);
          }
        });
      }
      else {
        this.loading = false;
      }

      this.bookmarks = bookmarks;
      this.setDataSource();
    }
  }

  private toggleBlocked(): void {
    this.showBlocked = !this.showBlocked;
    this.matButtonToggleText = (this.showBlocked ? this.translocoService.translate('BookmarksListviewComponent.ShowNonBlocked') : this.translocoService.translate('BookmarksListviewComponent.ShowBlocked'));
    this.matButtonToggleIcon = (this.showBlocked ? 'remove_moderator' : 'shield');
    this.refreshBookmarks(this.showBlocked);
  }

  // Load Detalails page
  private loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  private async openImageDialog(bookmark: Bookmark): Promise<void> {
    this.loading = true;
    let profile: Profile;

    this.subs.push(
      this.profileService.getProfileById(bookmark.profileId)
      .subscribe({
        next: (res: any) =>  { profile = res },
        complete: () => {          
          this.getProfileImages(profile);

          const dialogRef = this.dialog.open(ImageDialog, {
            data: {
              index: 0,
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

          this.loading = false;
        },
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotGetProfile'), null);
          this.loading = false;
        }
      })
    );
  }

  private getProfileImages(profile: Profile): void {
    if (profile.images != null && profile.images.length > 0) {
      if (profile.images.length > 0) {

        profile.images.forEach((element, i) => {

          if (typeof element.fileName !== 'undefined') {
            element.image = this.pinacothecaUrl + profile.profileId + '/' + element.fileName
          }

        });
      }
    }
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