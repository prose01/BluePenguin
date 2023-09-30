import { Component, OnInit, ViewChild, ChangeDetectorRef, EventEmitter, Output, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { ChatMember } from '../../models/chatMember';
import { ProfileService } from '../../services/profile.service';
import { ImageModel } from '../../models/imageModel';
import { ImageService } from '../../services/image.service';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'chatMemebers-listview',
  templateUrl: './chatMembers-listview.component.html'
})

export class ChatMembersListviewComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;
  private chatMembers: ChatMember[];

  private showBlocked: boolean = false;
  private matButtonToggleText: string;
  private matButtonToggleIcon: string = 'shield';

  private displayedColumns: string[] = ['select', 'avatar', 'name', 'status'];
  private selection = new SelectionModel<ChatMember>(true, []);
  public dataSource: MatTableDataSource<ChatMember>;

  public loading: boolean = true;

  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog, private readonly translocoService: TranslocoService) { }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject
        .subscribe(currentUserSubject => {
          this.currentUserSubject = currentUserSubject; this.refreshChatmemberlist(false);
        })
    );

    this.subs.push(
      this.translocoService.selectTranslate('ChatMembersListviewComponent.ShowBlocked').subscribe(value => this.matButtonToggleText = value)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private updateCurrentUserSubject() {
    this.profileService.updateCurrentUserSubject().then(res => { this.refreshChatmemberlist(true); this.toggleBlocked(); });
  }

  private setDataSource(): void {
    this.loading = false;
    this.dataSource = new MatTableDataSource<ChatMember>(this.chatMembers);

    this.dataSource.sortingDataAccessor = (item, property) => {
      switch (property) {
        case 'avatar.initials': return item.avatar.initials;
        default: return item[property];
      }
    };

    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get pagination & sort working.
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
  private checkboxLabel(row?: ChatMember): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.profileId}`;
  }

  private blockChatMembers(): void {
    this.subs.push(
      this.profileService.blockChatMembers(this.selcetedProfileIds())
      .subscribe({
        next: () =>  {},
        complete: () => {
          this.updateCurrentUserSubject() 
        },
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotBlockChatMembers'), null);
        }
      })
    );
  }

  private selcetedProfileIds(): string[] {
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

  private refreshChatmemberlist(showBlocked: boolean): void {
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

  private toggleBlocked(): void {
    this.showBlocked = !this.showBlocked;
    this.matButtonToggleText = (this.showBlocked ? this.translocoService.translate('ChatMembersListviewComponent.ShowNonBlocked') : this.translocoService.translate('ChatMembersListviewComponent.ShowBlocked'));
    this.matButtonToggleIcon = (this.showBlocked ? 'remove_moderator' : 'shield');
    this.refreshChatmemberlist(this.showBlocked);
  }

  // Load Detalails page
  private loadDetails(profile: Profile) {
    this.loadProfileDetails.emit(profile);
  }

  private async openImageDialog(chatMember: ChatMember): Promise<void> {
    this.loading = true;
    let profile: Profile;

    this.subs.push(
      this.profileService.getProfileById(chatMember.profileId)
      .subscribe({
        next: (res: any) =>  { profile = res },
        complete: () => {          
          this.getProfileImages(profile);

          const dialogRef = this.dialog.open(ImageDialog, {
            data: {
              index: 0,
              imageModels: profile.images,
              profile: profile
            }
          });

          this.subs.push(
            dialogRef.afterClosed().subscribe(
              res => {
                if (res === true) { this.loadDetails(profile) }
              }
            )
          );
        },
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotGetProfile'), null);
        }
      })
    );
  }

  private getProfileImages(profile: Profile): void {
    let defaultImageModel: ImageModel = new ImageModel();

    if (profile.images != null && profile.images.length > 0) {
      if (profile.images.length > 0) {

        profile.images.forEach((element, i) => {

          if (typeof element.fileName !== 'undefined') {

            element.image = 'https://freetrail.blob.core.windows.net/photos/' + profile.profileId + '/' + element.fileName

            //this.loading = true;
          }

        });
      }
    }
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
