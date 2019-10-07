import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';

import { Profile } from '../models/profile';
import { ProfileService } from '../services/profile.service';

@Component({
    selector: 'app-profile-listview',
    templateUrl: './profile-listview.component.html',
    styleUrls: ['./profile-listview.component.css']
})
export class ProfileListviewComponent implements OnInit {
    profiles: Profile[];
    displayedColumns: string[] = ['profileId', 'name', 'email', 'createdOn'];
    dataSource: MatTableDataSource<Profile>;

    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(private router: Router, private profileService: ProfileService, private cdr: ChangeDetectorRef) { }

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

    onSelect(profile: Profile): void {
        this.router.navigate(['/detail', profile.profileId]);
    }
}
