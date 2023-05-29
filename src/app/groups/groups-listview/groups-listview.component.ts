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
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { GroupModel } from '../../models/groupModel';
import { CreateGroupDialog } from '../create-group-dialog/create-group-dialog';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'groups-listview',
  templateUrl: './groups-listview.component.html',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class GroupsListviewComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;
  private groups: GroupModel[];

  private defaultPageSize: number;
  private length: number;

  public displayedColumns: string[] = ['avatar','name', 'joined'];
  private columnsToDisplayWithExpand = [...this.displayedColumns];
  private selection = new SelectionModel<GroupModel>(true, []);
  public dataSource: MatTableDataSource<GroupModel>;
  public expandedElement: GroupModel[] | null;


  public groupForm: FormGroup;

  public loading: boolean = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(private profileService: ProfileService, private cdr: ChangeDetectorRef, private dialog: MatDialog, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.defaultPageSize = this.configurationLoader.getConfiguration().defaultPageSize;
    this.createForm();
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject
        .subscribe(currentUserSubject => {
          this.currentUserSubject = currentUserSubject;
          this.getGroups();
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private createForm(): void {
    this.groupForm = this.formBuilder.group({
      searchfield: null
    });
  }

  onSubmit(): void {
    const formModel = this.groupForm.value;
    const filter = formModel.searchfield as string;
    this.getGroupsByFilter(filter);
  }

  reset(): void {
    this.createForm();
  }

  // Get Groups by filter. 
  private getGroupsByFilter(filter: string, currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getGroupsByFilter(filter, pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.groups = new Array;

            this.groups.push(...response);

            this.length = this.groups.length + currentSize + 1;
          },
          complete: () => { this.setDataSource(); this.loading = false; },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetGroupsByFilter'), null); this.loading = false;
          }
        })
    );
  }

  private updateCurrentUserSubject() {
    this.profileService.updateCurrentUserSubject().then(res => {
      this.getGroups();
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

  //pageChanged(event) {
  //  this.loading = true;

  //  let pageIndex = event.pageIndex;
  //  let pageSize = event.pageSize;
  //  let currentSize = pageSize * pageIndex;

  //  console.log('pageChanged');
  //  //this.getChatMemberProfiles(currentSize, pageIndex, pageSize);
  //}


  private getGroups(currentSize: number = 0, pageIndex: number = 0, pageSize: number = this.defaultPageSize): void {
    this.subs.push(
      this.profileService.getGroups(pageIndex, pageSize)
        .subscribe({
          next: (response: any) => {

            this.groups = new Array;

            this.groups.push(...response);

            this.length = this.groups.length + currentSize + 1;
          },
          complete: () => { this.setDataSource(); this.loading = false; },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotGetGroups'), null); this.loading = false;
          }
        })
    );
  }

  private async openCreateGroupDialog(): Promise<void> {

    const dialogRef = this.dialog.open(CreateGroupDialog, {});

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res?.name.length > 0) {
            this.createGroup(res);
          }
        }
      )
    );
  }

  private createGroup(group: GroupModel): void {
    this.subs.push(
      this.profileService.createGroup(group)
        .subscribe({
          next: () => { },
          complete: () => {
            this.updateCurrentUserSubject();
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotCreateGroup'), null);
          }
        })
    );
  }

  private toggleGroupJoin(groupId: string): void {

    var joined = this.joinedGroup(groupId);

    if (joined) {
      this.leaveGroup(groupId);
    }
    else {
      this.joinGroup(groupId);
    }
  }

  private joinGroup(groupId: string): void {
    this.subs.push(
      this.profileService.joinGroup(groupId)
        .subscribe({
          next: () => { },
          complete: () => {
            this.updateCurrentUserSubject();
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotJoinGroup'), null);
          }
        })
    );
  }

  private leaveGroup(groupId: string): void {
    let selcetedGroupIds = new Array;
    selcetedGroupIds.push(groupId);

    this.subs.push(
      this.profileService.removeGroupsFromCurrentUserAndCurrentUserFromGroups(selcetedGroupIds)
        .subscribe({
          next: () => { },
          complete: () => {
            this.updateCurrentUserSubject();
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotLeaveGroup'), null);
          }
        })
    );
  }

  //private isCurrentUserBlocked(group: GroupModel): boolean {
  //  for (var i = 0; i < group?.groupMemberslist?.length; i++) {
  //    var member = group.groupMemberslist[i];
  //    if (member.profileId == this.currentUserSubject.profileId && member.blocked)
  //      return true
  //  }

  //  return false
  //}

  private joinedGroup(groupId: string): boolean {
    if (this.currentUserSubject.groups.indexOf(groupId) !== -1) {
      return true;
    }

    return false;
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
