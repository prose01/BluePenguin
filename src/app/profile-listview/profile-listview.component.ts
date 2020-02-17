import { Component, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { Profile } from '../models/profile';
import { GenderType, BodyType } from '../models/enums';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile-listview',
  templateUrl: './profile-listview.component.html',
  styleUrls: ['./profile-listview.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProfileListviewComponent {
  displayedColumns: string[] = ['select', 'profileId', 'name', 'email'];
  dataSource: MatTableDataSource<Profile>;
  selection = new SelectionModel<Profile>(true, []);

  @Input() profiles: Profile[]; // Brug RxJS BehaviorSubject !!!!! Således at add-remove bookmarks opdateret auto.

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private cdr: ChangeDetectorRef) { }

  ngOnChanges(): void {
    this.setDataSource();
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource<Profile>(this.profiles);

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
    this.profileService.removeProfilesFromBookmarks(this.selcetedProfiles()).subscribe(() => {});
  }

  addFavoritProfiles() {
    this.profileService.addProfilesToBookmarks(this.selcetedProfiles()).subscribe(() => {});
  }

  selcetedProfiles(): string[] {
    let profiles = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      profiles.push(this.selection.selected[_i].profileId);
    }

    return profiles;
  }
}
