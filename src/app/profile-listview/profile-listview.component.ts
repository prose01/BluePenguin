import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
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
    displayedColumns: string[] = ['profileId', 'name', 'email'];
    dataSource: MatTableDataSource<Profile>;
    expandedElement: Profile | null;

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

    goBack(): void {
        this.location.back();
    }
}
