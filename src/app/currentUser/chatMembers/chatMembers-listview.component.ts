import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ChatMember } from '../../models/chatMember';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'chatMemebers-listview',
  templateUrl: './chatMembers-listview.component.html',
  styleUrls: ['./chatMembers-listview.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

@AutoUnsubscribe()
export class ChatMembersListviewComponent implements OnInit {
  displayedColumns: string[] = ['select', 'profileId', 'name', 'blocked'];
  dataSource: MatTableDataSource<ChatMember>;
  selection = new SelectionModel<ChatMember>(true, []);

  currentUserSubject: CurrentUser;
  chatMembers: ChatMember[];
  profileIds: string[] = [];
  profiles: Profile[];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public auth: AuthService, private profileService: ProfileService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.profileService.currentUserSubject
      .pipe(takeWhileAlive(this))
      .subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);

    setTimeout(() => {
      this.refreshChatmemberlist();
    }, 500);
  }

  ngOnChanges(): void {
    if (this.auth.isAuthenticated()) {
      this.setDataSource();
    }
  }

  updateCurrentUserSubject() {
    this.profileService.updateCurrentUserSubject();
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource<ChatMember>(this.chatMembers);

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
  checkboxLabel(row?: ChatMember): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.profileId}`;
  }

  blockChatMembers() {
    this.profileService.blockChatMembers(this.selcetedProfiles())
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => { this.updateCurrentUserSubject() });

    setTimeout(() => {
      this.refreshChatmemberlist();
    }, 500);
  }

  selcetedProfiles(): string[] {
    let profiles = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      profiles.push(this.selection.selected[_i].profileId);
    }

    return profiles;
  }

  setChatmemberProperties() {
    let profiles = this.profiles;
    this.chatMembers.forEach(function (value) {
      let profile = profiles.find(i => i.profileId === value.profileId);
      value.name = profile.name;
    });

    this.setDataSource();
  }

  refreshChatmemberlist() {
    let chatMembers = new Array;
    let profileIds = new Array;
    if (this.currentUserSubject != null) {
      if (this.currentUserSubject.chatMemberslist.length > 0) {
        this.currentUserSubject.chatMemberslist.forEach(function (member) {
          chatMembers.push(member);
          profileIds.push(member.profileId);
        });

        this.chatMembers = chatMembers;
        this.profileIds = profileIds;
        this.profileService.getChatMemberProfiles()
          .pipe(takeWhileAlive(this))
          .subscribe(profiles => this.profiles = profiles, () => { }, () => { this.setChatmemberProperties() });
      }
    }
  }
}
