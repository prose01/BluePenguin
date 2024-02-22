import { Component, OnInit, Inject, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { Profile } from '../../models/profile';
import { GroupModel } from '../../models/groupModel';
import { ProfileService } from '../../services/profile.service';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'group-description-dialog',
  templateUrl: './group-description-dialog.html'
})

export class GroupDescriptionDialog implements OnInit, OnDestroy {
  public dataSource: MatTableDataSource<Profile>;
  matDialogTitle: string;
  matDialogContent: string;
  joined: boolean;

  private subs: Subscription[] = [];
  private currentGroup: GroupModel;
  private groupMember: Profile[];
  private displayedColumns: string[] = ['avatar', 'name'];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private dialog: MatDialog, public dialogRef: MatDialogRef<GroupDescriptionDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any, private cdr: ChangeDetectorRef, private readonly translocoService: TranslocoService) {

    this.currentGroup = data.group;
    this.matDialogTitle = this.data.group.name;
    this.matDialogContent = this.data.group.description;
    this.joined = this.data.joinedGroup;

    if (this.joined) {
      this.displayedColumns.push('complain');
    }
    
    //remove currentUser
    this.groupMember = data.group.groupMemberslist.filter((element, i) => element.profileId !== data.currentUserProfileId); 
  }

  ngOnInit(): void {
    this.setDataSource();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  toggleGroupJoin(): void {
    this.dialogRef.close(true);
  }

  private setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.groupMember);

    //this.dataSource.sortingDataAccessor = (item, property) => {
    //  switch (property) {
    //    case 'avatar.initials': return item.avatar.initials;
    //    default: return item[property];
    //  }
    //};

    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get sort working.
    this.dataSource.sort = this.sort;
  }

  private complain(profileId: string): void {
    this.subs.push(
      this.profileService.addComplainToGroupMember(this.currentGroup.groupId, profileId)
        .subscribe({
          next: () => { },
          complete: () => {
            // TODO: Do we need to notify user that a complain has been made. No, if too many complains user is blocked.
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotComplainAboutGroupMember'), null);
          }
        })
    );
  }

  //// Load Detalails page
  //private loadDetails(profile: Profile) {
  //  //this.loadProfileDetails.emit(profile);
  //}

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }
}
