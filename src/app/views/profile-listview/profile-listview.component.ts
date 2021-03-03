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
  @Input() displayedColumns: string[];
  @Input() showingBookmarkedProfilesList: boolean;
  @Output() loadLessonsPage: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public auth: AuthService, private profileService: ProfileService, private cdr: ChangeDetectorRef, private dialog: MatDialog) { }

  ngOnInit() {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
  }

  //updateCurrentUserSubject() {
  //  this.profileService.updateCurrentUserSubject();
  //}

  ngOnChanges(): void {
    if (this.auth.isAuthenticated()) {
      this.setDataSource();
    }
  }

  getNextData(currentSize: number, pageIndex: string, pageSize: string) {
    this.profileService.getLatestProfiles(OrderByType.CreatedOn, 'desc', pageIndex, pageSize).pipe(takeWhileAlive(this))
      .subscribe((response: any) => {
        this.loading = false;

        this.profiles.length = currentSize;

        this.profiles.push(...response);

        this.profiles.length = this.profiles.length + 1;


        this.dataSource = new MatTableDataSource<Profile>(this.profiles);
        this.dataSource._updateChangeSubscription();

        this.dataSource.paginator = this.paginator;
      });
  }

  pageChanged(event) {
    this.loading = true;

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;

    let previousIndex = event.previousPageIndex;

    let previousSize = pageSize * pageIndex;

    this.getNextData(previousSize, (pageIndex).toString(), pageSize.toString());
  }


  //public getServerData(event?: PageEvent) {
  //  this.loadLessonsPage.emit({ pageIndex: event.pageIndex, pageSize: event.pageSize });
  //  console.log('profile size ' + this.profiles.length);
  //}

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
        this.profileService.getBookmarkedProfiles()
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
