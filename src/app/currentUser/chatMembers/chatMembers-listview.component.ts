import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { TranslocoService } from '@ngneat/transloco';

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
  styleUrls: ['./chatMembers-listview.component.scss']
})

@AutoUnsubscribe()
export class ChatMembersListviewComponent implements OnInit {
  displayedColumns: string[] = ['select', 'name', 'status'];
  dataSource: MatTableDataSource<ChatMember>;
  selection = new SelectionModel<ChatMember>(true, []);

  currentUserSubject: CurrentUser;
  chatMembers: ChatMember[];

  showBlocked: boolean = false;
  matButtonToggleText: string;
  matButtonToggleIcon: string = 'shield';

  loading: boolean = true;

  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog, private readonly translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.profileService.currentUserSubject
      .subscribe(currentUserSubject => {
        this.currentUserSubject = currentUserSubject; this.refreshChatmemberlist(false);
      });

    this.translocoService.selectTranslate('ChatMembersListviewComponent.ShowBlocked').subscribe(value => this.matButtonToggleText = value);
  }

  updateCurrentUserSubject() {
    this.profileService.updateCurrentUserSubject().then(res => { this.refreshChatmemberlist(true); this.toggleBlocked(); });
  }

  setDataSource(): void {
    this.loading = false;
    this.dataSource = new MatTableDataSource<ChatMember>(this.chatMembers);
    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get pagination & sort working.
    //this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    //const numSelected = this.selection.selected.length;
    //const numRows = this.dataSource.data.length;
    //return numSelected === numRows;
    return this.selection.selected.length === this.dataSource.data.length;
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
  }

  selcetedProfileIds(): string[] {
    let profileIds = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      profileIds.push(this.selection.selected[_i].profileId);
    }

    return profileIds;
  }

  //pageChanged(event) {
  //  this.loading = true;

  //  let pageIndex = event.pageIndex;
  //  let pageSize = event.pageSize;
  //  let currentSize = pageSize * pageIndex;

  //  console.log('pageChanged');
  //  //this.getChatMemberProfiles(currentSize, pageIndex, pageSize);
  //}

  refreshChatmemberlist(showBlocked: boolean) {
    let chatMembers = new Array;
    if (this.currentUserSubject != null) {
      if (this.currentUserSubject.chatMemberslist.length > 0) {
        this.currentUserSubject.chatMemberslist.forEach(function (member) {
          if (showBlocked == member.blocked) {
            chatMembers.push(member);
          }
        });

        this.chatMembers = chatMembers;
        this.setDataSource();
      }
      else {
        this.loading = false;
      }
    }
  }

  toggleBlocked() {
    this.showBlocked = !this.showBlocked;
    this.matButtonToggleText = (this.showBlocked ? this.translocoService.translate('ChatMembersListviewComponent.ShowNonBlocked') : this.translocoService.translate('ChatMembersListviewComponent.ShowBlocked'));    // TODO: Translate!!
    this.matButtonToggleIcon = (this.showBlocked ? 'remove_moderator' : 'shield');
    this.refreshChatmemberlist(this.showBlocked);
  }

  // Load Detalails page
  loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  async openImageDialog(chatMember: ChatMember): Promise<void> {
    this.loading = true;
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
                images => { element.smallimage = 'data:image/jpeg;base64,' + images.toString() },
                () => { this.loading = false; element.smallimage = defaultImageModel.smallimage },
                () => { this.loading = false; }
              );

            this.imageService.getProfileImageByFileName(profile.profileId, element.fileName, ImageSizeEnum.large)
              .pipe(takeWhileAlive(this))
              .subscribe(
                images => { element.image = 'data:image/jpeg;base64,' + images.toString() },
                () => { this.loading = false; element.image = defaultImageModel.image },
                () => { this.loading = false; }
              );
          }

        });
      }
    }
  }
}
