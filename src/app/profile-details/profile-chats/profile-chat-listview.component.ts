import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MediaMatcher } from '@angular/cdk/layout';

import { ErrorDialog } from '../../error-dialog/error-dialog.component';
import { ProfileService } from '../../services/profile.service';
import { ChatService } from '../../services/chat.service';
import { ImageService } from '../../services/image.service';
import { TranslocoService } from '@ngneat/transloco';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { Feedback } from '../../models/feedback';
import { Message } from 'ng-chat';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageModel } from '../../models/imageModel';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';

@Component({
  selector: 'profile-chat-listview',
  templateUrl: './profile-chat-listview.component.html',
  styleUrls: ['./profile-chat-listview.component.scss']
})

@AutoUnsubscribe()
export class ProfileChatListviewComponent implements OnInit, OnChanges {

  @Output("loadDetails") loadDetails: EventEmitter<any> = new EventEmitter();

  @Input() profile: Profile;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  loading: boolean = false;
  noFeedbacks: boolean = false;

  currentUserSubject: CurrentUser;

  messages: Message[] = new Array;

  dataSource: MatTableDataSource<Message>;
  selection = new SelectionModel<Message>(true, []);

  displayedColumns: string[] = ['select', 'fromId', 'fromName', 'toId', 'toName', 'dateSent', 'dateSeen'];


  constructor(private chatService: ChatService, private profileService: ProfileService, private imageService: ImageService, private cdr: ChangeDetectorRef, private dialog: MatDialog, media: MediaMatcher, private readonly translocoService: TranslocoService) {

  }

  ngOnInit(): void {
    this.loading = true;

    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });

    this.getProfileMessages();
  }

  ngOnChanges(): void {   

    this.getProfileMessages();
  }

  getProfileMessages() {
    this.chatService.getProfileMessages(this.profile.profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.messages = new Array;

          this.messages.push(...response);
        },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null); this.loading = false;
        },
        () => {
          this.updateMessageList();
        }
      );
  }

  updateMessageList() {
    this.messages = this.messages?.filter(function (el) {
      return el != null;
    });

    this.messages?.length <= 0 ? this.noFeedbacks = true : this.noFeedbacks = false;

    this.setDataSource();

    this.loading = false;
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.messages);
    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get pagination & sort working.
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    //const numSelected = this.selection.selected.length;
    //const numRows = this.dataSource.data.length > 1 ? this.dataSource.data.length - 1 : this.dataSource.data.length;
    ////this.allowAssignment = numSelected > 0 ? true : false;
    //return numSelected === numRows;
    return this.selection.selected.length === this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Message): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row}`; // TODO: row ${row} needs an id.
  }

  selcetedFeedbackIds(): Feedback[] {
    let ids = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {
      ids.push(this.selection.selected[_i].message);    // TODO: Cannot select on Id for message.
    }

    return ids;
  }

  async openImageDialog(message: Message): Promise<void> {

    var profileId = message.fromId == this.profile.profileId ? message.toId : message.fromId;

    // Do not open dialog if it is currentUser
    if (profileId == this.currentUserSubject.profileId) {
      this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null);
      return;
    }

    var profile: Profile;

    this.profileService.getProfileById(profileId)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {
          profile = response;

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
              if (res === true) { this.loadDetails.emit(profile); }
            }
          );
        },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null);
        },
        () => { }
      );
  }

  getProfileImages(profile: Profile): void {
    let defaultImageModel: ImageModel = new ImageModel();

    if (profile.images != null && profile.images.length > 0) {

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
    else {
      // Set default profile image.
      profile.images[0] = defaultImageModel;
    }
  }

  openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }
}
