import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';

import { ErrorDialog } from '../../error-dialog/error-dialog.component';
import { ProfileService } from '../../services/profile.service';
import { ChatService } from '../../services/chat.service';
import { TranslocoService } from '@ngneat/transloco';
import { CurrentUser } from '../../models/currentUser';
import { Profile } from '../../models/profile';
import { Feedback } from '../../models/feedback';
import { MessageModel } from '../../models/messageModel';
import { MessageDialog } from '../profile-chat-message-dialog/profile-chat-message-dialog';
import { ProfileChatSearchComponent } from '../profile-chat-search/profile-chat-search.component';
import { ChatFilter } from '../../models/chatFilter';

@Component({
  selector: 'profile-chat-listview',
  templateUrl: './profile-chat-listview.component.html',
  styleUrls: ['./profile-chat-listview.component.scss']
})

@AutoUnsubscribe()
export class ProfileChatListviewComponent implements OnInit, OnChanges, OnDestroy {

  @Output("loadDetails") loadDetails: EventEmitter<any> = new EventEmitter();
  @Output("chatSearch") chatSearch: EventEmitter<any> = new EventEmitter();

  @Input() profile: Profile;

  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(ProfileChatSearchComponent) profileChatSearchComponent: ProfileChatSearchComponent;

  loading: boolean = false;
  noFeedbacks: boolean = false;

  currentUserSubject: CurrentUser;

  messages: MessageModel[] = new Array;

  dataSource: MatTableDataSource<MessageModel>;
  selection = new SelectionModel<MessageModel>(true, []);

  displayedColumns: string[] = ['select', 'fromId', 'fromName', 'toId', 'toName', 'dateSent', 'dateSeen'];

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  constructor(private chatService: ChatService, private profileService: ProfileService, private cdr: ChangeDetectorRef, private dialog: MatDialog, media: MediaMatcher, private readonly translocoService: TranslocoService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => cdr.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.loading = true;

    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; });

    this.getProfileMessages();
  }

  ngOnChanges(): void {   

    this.getProfileMessages();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
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

  toggleDisplay() {
    this.chatSearch.emit(true);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: MessageModel): string {
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

  // Calls to ProfileChatSearchComponent
  onSubmit() {
    this.profileChatSearchComponent.onSubmit();
    this.sidenav.close();
  }

  reset() {
    this.profileChatSearchComponent.reset();
    this.getProfileMessages();
  }

  getChatsByFilter(chatFilter: ChatFilter, pageIndex: string = '0', pageSize: string = '20') {
    this.chatService.getChatsByFilter(chatFilter, pageIndex, pageSize)
      .pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.messages = new Array;

          this.messages.push(...response);
        },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('ProfileChatSearchComponent.CouldNotGetChatsByFilter'), null); this.loading = false;
        },
        () => {
          this.updateMessageList();
        }
      );
  }

  /** Allow or disallow Message Delete */
  toggleDoNotDelete() {

    var doNotDelete: MessageModel[] = new Array;
    var allowDelete: MessageModel[] = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {

      var message = this.selection.selected[_i];

      if (message.doNotDelete) {
        allowDelete.push(message);
      }
      else {
        doNotDelete.push(message);
      }
    }

    if (doNotDelete.length > 0) {
      this.chatService.doNotDelete(doNotDelete)
        .pipe(takeWhileAlive(this))
        .subscribe(() => { }, () => { }, () => {});
    }

    if (allowDelete.length > 0) {
      this.chatService.allowDelete(allowDelete)
        .pipe(takeWhileAlive(this))
        .subscribe(() => { }, () => { }, () => {});
    }

    console.log(doNotDelete);
    console.log(allowDelete);

    this.getProfileMessages();
  }

  async openMessageDialog(message: MessageModel): Promise<void> {
    console.log('Open a message dialog');

    const dialogRef = this.dialog.open(MessageDialog, {
      data: {
        message: message
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res === true) { /*this.loadDetails(feedback.fromProfileId)*/ }
      }
    );
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
