import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ChatMember } from '../../models/chatMember';
import { ProfileService } from '../../services/profile.service';
import { ImageModel } from '../../models/imageModel';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageService } from '../../services/image.service';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';

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
  profiles: Profile[];
  loading: boolean = true;

  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog) { }

  ngOnInit() {
    this.profileService.currentUserSubject
      .pipe(takeWhileAlive(this))
      .subscribe(
        () => { currentUserSubject => this.currentUserSubject = currentUserSubject },
        () => { },
        () => { this.refreshChatmemberlist() }
      );

    //setTimeout(() => {
    //  this.refreshChatmemberlist(); // TODO: Find på noget bedre
    //}, 500);
  }

  ngOnChanges(): void {
    if (this.auth.isAuthenticated()) {
      this.setDataSource();
    }
  }

  updateCurrentUserSubject() {
    this.profileService.updateCurrentUserSubject().then(res => this.refreshChatmemberlist());
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource<ChatMember>(this.chatMembers);
    this.dataSource._updateChangeSubscription();

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
    this.profileService.blockChatMembers(this.selcetedProfileIds())
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => { this.updateCurrentUserSubject() });

    //setTimeout(() => {
    //  this.refreshChatmemberlist();
    //}, 500);
  }

  selcetedProfileIds(): string[] {
    let profileIds = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      profileIds.push(this.selection.selected[_i].profileId);
    }

    return profileIds;
  }

  pageChanged(event) {
    this.loading = true;

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let currentSize = pageSize * pageIndex;

    this.getChatMemberProfiles(currentSize, pageIndex, pageSize);
  }

  refreshChatmemberlist() {
    let chatMembers = new Array;
    if (this.currentUserSubject != null) {
      if (this.currentUserSubject.chatMemberslist.length > 0) {
        this.currentUserSubject.chatMemberslist.forEach(function (member) {
          chatMembers.push(member);
        });

        this.chatMembers = chatMembers;

        this.getChatMemberProfiles();
      }
    }
  }

  getChatMemberProfiles(currentSize: number = 0, pageIndex: string = '0', pageSize: string = '5') {
    this.profileService.getChatMemberProfiles(pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.profiles = new Array;

          this.profiles.length = currentSize;

          this.profiles.push(...response);

          this.profiles.length = this.profiles.length + 1;

          if (this.profiles.length > 1) {
            this.setChatmemberProperties();
          }
        }
        , () => { }
        , () => { }
      );
  }

  setChatmemberProperties() {
    let profiles = this.profiles;
    this.chatMembers.forEach(function (value) {
      let profile = profiles.find(i => i.profileId === value.profileId);
      value.name = profile.name;
    });

    this.setDataSource(); // TODO: Find på noget bedre end at gøre dette igen
  }



  // Load Detalails page
  loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  async openImageDialog(chatMember: ChatMember): Promise<void> {

    let profile: Profile;

    this.profileService.getProfileById(chatMember.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(
        res => profile = res,
        () => { },
        () => {
          this.getProfileImages(profile);

          const dialogRef = this.dialog.open(ImageDialog, {
            data: {
              index: 0,
              imageModels: profile.images,
              profile: profile
            }
          });

          dialogRef.afterClosed().subscribe(
            res => {
              if (res === true) { this.loadDetails(profile) }
            }
          );
        }
      );    
  }

  getProfileImages(profile: Profile): void {
    let defaultImageModel: ImageModel = new ImageModel();

    if (profile.images != null && profile.images.length > 0) {
      if (profile.images.length > 0) {

        profile.images.forEach((element, i) => {

          if (typeof element.fileName !== 'undefined') {

            this.loading = true;

            this.imageService.getProfileImageByFileName(profile.profileId, element.fileName, ImageSizeEnum.small)
              .pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.smallimage = 'data:image/png;base64,' + images.toString() },
                () => { this.loading = false; element.smallimage = defaultImageModel.smallimage },
                () => { this.loading = false; }
              );

            this.imageService.getProfileImageByFileName(profile.profileId, element.fileName, ImageSizeEnum.large)
              .pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.image = 'data:image/png;base64,' + images.toString() },
                () => { this.loading = false; element.image = defaultImageModel.image },
                () => { this.loading = false; }
              );
          }

        });
      }
    }
  }
}
