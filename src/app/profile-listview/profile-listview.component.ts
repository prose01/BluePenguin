import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location } from '@angular/common';

import { Profile } from '../models/profile';
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
export class ProfileListviewComponent implements OnInit {
    profiles: Profile[];
    displayedColumns: string[] = ['select', 'profileId', 'name', 'email'];
    dataSource: MatTableDataSource<Profile>;
    expandedElement: Profile | null;
    selection = new SelectionModel<Profile>(true, []);

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(private router: Router, private profileService: ProfileService, private location: Location, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.getProfiles();
    }

    getProfiles(): void {
        this.profileService.getProfiles().subscribe((result) => {
            this.dataSource = new MatTableDataSource<Profile>(result);

            this.cdr.detectChanges(); // Needed to get pagination & sort working.
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        })
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

    removeFavoritProfiles() {
        this.profileService.removeFavoritProfiles(this.selcetedProfiles()).subscribe((result) => {
        });
    }

    addFavoritProfiles() {
        this.profileService.addFavoritProfiles(this.selcetedProfiles()).subscribe((result) => {
        });
    }

    selcetedProfiles(): string[] {
        let profiles = new Array;

        for (var _i = 0; _i < this.selection.selected.length; _i++) {
            profiles.push(this.selection.selected[_i].profileId);
        }

        return profiles;
    }
}
