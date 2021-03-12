import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { DeleteProfileDialog } from '../../currentUser/delete-profile/delete-profile-dialog.component';
import { ViewFilterTypeEnum } from '../../models/viewFilterTypeEnum';

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
export class ProfileListviewComponent implements OnInit {
  pageEvent: PageEvent;
  datasource: null;
  pageIndex: number;
  pageSize: number;
  length: number;
  loading: boolean = true;

  dataSource: MatTableDataSource<Profile>;
  selection = new SelectionModel<Profile>(true, []);

  currentUserSubject: CurrentUser;

  @Input() profiles: Profile[];
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Input() displayedColumns: string[];
  @Output() getNextData: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public auth: AuthService, private profileService: ProfileService, private cdr: ChangeDetectorRef, private dialog: MatDialog) { }

  ngOnInit() {
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
    const numRows = this.dataSource.data.length;
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
    this.profileService.removeProfilesFromBookmarks(this.selcetedProfiles())
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => {
        this.profileService.getBookmarkedProfiles('0', '5')   // TODO: Add pagination to this!!!!!!!!!!!!!!!!!!!!!!
          .pipe(takeWhileAlive(this))
          .subscribe(profiles => this.profiles = profiles, () => { }, () => {
        this.setDataSource()
      })
    });
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

  openDeleteProfilesDialog(): void {
    const dialogRef = this.dialog.open(DeleteProfileDialog, {
      height: '300px',
      width: '300px',
      data: this.selcetedProfiles()
    });
  }
}
