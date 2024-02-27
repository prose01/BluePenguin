import { Component, Input, OnInit, ChangeDetectorRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { GroupModel } from '../../models/groupModel';
import { CreateGroupDialog } from '../create-group-dialog/create-group-dialog';
import { GroupDescriptionDialog } from '../group-description-dialog/group-description-dialog';
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

  private defaultPageSize: number;
  private length: number;

  public groupForm: FormGroup;
  private byFilter: boolean = false;
  private filter: string;

  public loading: boolean = true;
  
  private _groups: any[];
  private currentPage: number = 0;
  public throttle = 150;
  public scrollDistance = 2;
  public scrollUpDistance = 2;
  public noResult: boolean = false;

  public currentGroups: any[] = [];
  private imageSize: string[] = []
  private randomImagePlace: number;
  private adGroup: number;

  @Input() set groups(values: any[]) {
    this._groups = values;
    this.updateGroups();
  }
  get groups(): any[] {
    return this._groups;
  }
  
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  constructor(private profileService: ProfileService, private cdr: ChangeDetectorRef, private dialog: MatDialog, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.defaultPageSize = this.configurationLoader.getConfiguration().defaultPageSize;
    this.randomImagePlace = this.configurationLoader.getConfiguration().randomImagePlace;
    this.adGroup = this.configurationLoader.getConfiguration().adGroup;
    this.createForm();
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );
    this.groups = new Array;
    this.currentGroups = new Array;
    this.getGroups();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private updateGroups(): void {

    // Add random ad-tile.
    for (let index = 0; index < this.groups?.length; index++) {

      // Group list of Group by AdGroup.
      if (index != 0 && index % this.adGroup === 0) {
        // Select random index within group and apply ad-tile.
        var i = this.randomIntFromInterval(index - this.adGroup, index);
        this.groups?.splice(i, 0, 'ad');
      }
    }

    // Set random image size.
    for (var i = 0, len = this.groups?.length; i < len; i++) {
      this.imageSize.push(this.randomSize());
    }

    // In case we only have small images set at leas one.
    if (this.groups?.length > 0 && !this.imageSize.includes('big')) {
      this.imageSize[this.randomImagePlace] = 'big'
    }

    if (this.groups?.length > 0) {
      this.currentGroups.push(...this.groups);
    }

    this.groups?.length <= 0 ? this.noResult = true : this.noResult = false;
    this.loading = false;
  }

  async resetCurrentGroups(): Promise<void> {
    this.groups = new Array;
    this.currentGroups = new Array;
  }

  onScrollDown(): void {
    var pageIndex = (this.currentGroups?.length - this.currentPage) / this.defaultPageSize;

    if (this.currentGroups?.length > this.defaultPageSize && this.currentPage == 0 || Math.floor(pageIndex) == (this.currentPage + 1)) {
      this.currentPage = Math.floor(pageIndex);

      if (this.byFilter) {
        this.getGroupsByFilter(this.filter, Math.floor(pageIndex));
      }
      else {
        this.getGroups(Math.floor(pageIndex));
      }
      this.loading = true;
    }
  }
  
  private createForm(): void {
    this.groupForm = this.formBuilder.group({
      searchfield: null
    });
  }

  onSubmit(): void {
    this.resetCurrentGroups();
    this.byFilter = true;
    const formModel = this.groupForm.value;
    this.filter = formModel.searchfield as string;
    this.getGroupsByFilter(this.filter);
  }

  // Get Groups by filter. 
  private getGroupsByFilter(filter: string, pageIndex: number = 0): void {
    this.subs.push(
      this.profileService.getGroupsByFilter(filter, pageIndex, this.defaultPageSize)
        .subscribe({
          next: (response: any) => {

            this.groups = new Array;

            this.groups.push(...response.groups);

            this.length = response.total;
          },
          complete: () => {
            this.updateGroups();
            this.loading = false;
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('GetGroupsByFilter'), null); this.loading = false;
          }
        })
    );
  }

  private getGroups(pageIndex: number = 0): void {
    this.subs.push(
      this.profileService.getGroups(pageIndex, this.defaultPageSize)
        .subscribe({
          next: (response: any) => {

            this.groups = new Array;

            this.groups.push(...response.groups);

            this.length = response.total;
          },
          complete: () => {
            this.updateGroups();
            this.loading = false;
          },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotGetGroups'), null); this.loading = false;
          }
        })
    );
  }

  private createGroup(group: GroupModel): void {
    this.subs.push(
      this.profileService.createGroup(group)
        .subscribe({
          next: () => {
            this.profileService.updateCurrentUserSubject();
            this.addNewGroup();
          },
          complete: () => { },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotCreateGroup'), null);
          }
        })
    );
  }

  private addNewGroup() {
    this.resetCurrentGroups();

    if (this.byFilter) {
      this.getGroupsByFilter(this.filter);
    }
    else {
      this.getGroups();
    }
  }

  public async openCreateGroupDialog(): Promise<void> {

    const dialogRef = this.dialog.open(CreateGroupDialog, {});

    this.subs.push(
      dialogRef.afterClosed().subscribe(
        res => {
          if (res?.name?.length > 0) {
            this.createGroup(res);
          }
        }
      )
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
          next: () => {
            this.profileService.updateCurrentUserSubject()
          },
          complete: () => { },
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
          next: () => {
            this.profileService.updateCurrentUserSubject()
          },
          complete: () => { },
          error: () => {
            this.openErrorDialog(this.translocoService.translate('CouldNotLeaveGroup'), null);
          }
        })
    );
  }

  public async openGroupDetailsDialog(group: GroupModel): Promise<void> {
    const dialogRef = this.dialog.open(GroupDescriptionDialog, {
      data: {
        group: group,
        joinedGroup: this.joinedGroup(group.groupId),
        currentUserProfileId: this.currentUserSubject.profileId
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res === 'toggleGroupJoin') {
          this.toggleGroupJoin(group.groupId);
        }
        if (res.loadProfileDetails === true) {
          this.loadProfileDetails.emit(res.profile);
        }
      }
    )
  }

  private joinedGroup(groupId: string): boolean {
    if (typeof this.currentUserSubject.groups[groupId] !== 'undefined') {
      return true;
    }

    return false;
  }

  // Set random tilesize for images.
  private randomSize(): string {
    var randomInt = this.randomIntFromInterval(1, this.randomImagePlace);

    if (randomInt === 1) {
      return 'big';
    }

    return 'small';
  }

  private randomIntFromInterval(min, max): number { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
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
