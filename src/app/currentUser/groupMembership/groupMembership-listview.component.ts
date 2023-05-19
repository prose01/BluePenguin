import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { GroupModel } from '../../models/groupModel';
import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { GroupMembersListview } from '../../groups/groupMembers-listview/groupMembers-listview.component';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'groupMembership-listview',
  templateUrl: './groupMembership-listview.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class GroupMembershipListviewComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;
  private groups: GroupModel[];

  private defaultPageSize: number;
  private currentProfiles: Profile[];
  private length: number;

  public displayedColumns: string[] = ['select', 'avatar', 'name'];
  private columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  private selection = new SelectionModel<GroupModel>(true, []);
  public dataSource: MatTableDataSource<GroupModel>;
  public expandedElement: GroupModel[] | null;

  public loading: boolean = true;

  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.defaultPageSize = this.configurationLoader.getConfiguration().defaultPageSize;
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject
        .subscribe(currentUserSubject => {
          this.currentUserSubject = currentUserSubject;
          this.getCurrenUsersGroups();
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private updateCurrentUserSubject() {
    this.profileService.updateCurrentUserSubject().then(res => {
      this.getCurrenUsersGroups();
    });
  }

  private setDataSource(): void {
    this.loading = false;
    this.dataSource = new MatTableDataSource<GroupModel>(this.groups);
    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get pagination & sort working.
    //this.dataSource.paginator = this.paginator;
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
  private checkboxLabel(row?: GroupModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.groupId}`;
  }

  private selcetedGroupIds(): string[] {
    let groupIds = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      groupIds.push(this.selection.selected[_i].groupId);
    }

    return groupIds;
  }

  //pageChanged(event) {
  //  this.loading = true;

  //  let pageIndex = event.pageIndex;
  //  let pageSize = event.pageSize;
  //  let currentSize = pageSize * pageIndex;

  //  console.log('pageChanged');
  //  //this.getChatMemberProfiles(currentSize, pageIndex, pageSize);
  //}


  private getCurrenUsersGroups(): void {
    this.subs.push(
      this.profileService.getCurrenUsersGroups()
        .subscribe({
          next: (response: any) => {

            this.groups = new Array;

            this.groups.push(...response);
          },
          complete: () => { this.setDataSource(); this.loading = false; },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotGetGroups'), null);
          }
        })
    );
  }

  private removeGroup(): void {
    this.subs.push(
      this.profileService.removeGroupsFromCurrentUserAndCurrentUserFromGroups(this.selcetedGroupIds())
        .subscribe({
          next: () => { },
          complete: () => {
            this.updateCurrentUserSubject();
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotRemoveGroups'), null);
          }
        })
    );
  }

  private getGroupMembers(group: GroupModel, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    let profileIds = new Array;
    
    for (var _i = 0; _i < group.groupMemberslist.length; _i++) {
      profileIds.push(group.groupMemberslist[_i].profileId);
    }

    this.subs.push(
      this.profileService.getProfilesByIds(profileIds, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.currentProfiles = new Array;

            this.currentProfiles.push(...response);

            //this.length = this.currentProfiles.length + currentSize + 1;
          },
          complete: () => { },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotGetGroupMembers'), null);
          }
        })
    );
  }

  private complainAboutGroupMember(profileId: string, groupId: string): void {

  }

  // Load Detalails page
  private loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  private async openGroupMembersListView(): Promise<void> {
    const dialogRef = this.dialog.open(GroupMembersListview, {
      data: {
        index: 0,
        profiles: this.currentProfiles
      }
    });

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res?.result === true) { this.loadDetails(res.profile) }
        }
      )
    );
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
