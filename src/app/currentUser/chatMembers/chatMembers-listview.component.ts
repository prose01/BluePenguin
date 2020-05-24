import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ChatMember } from '../../models/ChatMember';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'chatMemebers-listview',
  templateUrl: './chatMembers-listview.component.html',
  styleUrls: ['./chatMembers-listview.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ChatMembersListviewComponent implements OnInit {
  displayedColumns: string[] = ['select', 'profileId', 'name', 'createdOn'];
  dataSource: MatTableDataSource<Profile>;
  selection = new SelectionModel<Profile>(true, []);

  currentUserSubject: CurrentUser;
  chatMembers: ChatMember[];
  profileIds: string[] = [];
  profiles: Profile[];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public auth: AuthService, private profileService: ProfileService, private cdr: ChangeDetectorRef, private dialog: MatDialog) { }

  ngOnInit() {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);

    setTimeout(() => {
      let chatMembers = new Array;
      let profileIds = new Array;
      this.currentUserSubject.chatMemberslist.forEach(function (member) {
        chatMembers.push(member);
        profileIds.push(member.profileId);
      });

      this.chatMembers = chatMembers;
      this.profileIds = profileIds;
      this.profileService.getChatMemberProfiles().subscribe(profiles => this.profiles = profiles);

      setTimeout(() => {
      console.log(this.profiles);
        this.setDataSource()
      }, 1000);

    }, 500);
  }

  ngOnChanges(): void {
    if (this.auth.isAuthenticated()) {

      //let mb = new Array;
      //this.currentUserSubject.chatMemberslist.forEach(function (member) {
      //  mb.push(member);
      //  //this.chatMembers.push(member);
      //  //this.profileIds.push(member.profileId);
      //});
      //console.log('something ' + mb);

      //this.profileService.getProfilesById(this.profileIds).subscribe(profiles => this.profiles = profiles);

      this.setDataSource();
    }
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

  //blockChatMembers() {
  //  this.profileService.blockChatMembers(this.selcetedProfiles()).subscribe(() => { });
  //}

  selcetedProfiles(): string[] {
    let profiles = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      profiles.push(this.selection.selected[_i].profileId);
    }

    return profiles;
  }
}
