////import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
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
import { MessageModel } from '../../models/messageModel';
import { MessageDialog } from '../profile-chat-message-dialog/profile-chat-message-dialog';
import { ProfileChatSearchComponent } from '../profile-chat-search/profile-chat-search.component';
import { ChatFilter } from '../../models/chatFilter';

@Component({
  selector: 'profile-chat-listview',
  templateUrl: './profile-chat-listview.component.html',
  styleUrls: ['./profile-chat-listview.component.scss']
})

//@AutoUnsubscribe()
export class ProfileChatListviewComponent implements OnInit, OnChanges, OnDestroy {

  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();
  @Output("chatSearch") chatSearch: EventEmitter<any> = new EventEmitter();

  @Input() profile: Profile;

  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(ProfileChatSearchComponent) profileChatSearchComponent: ProfileChatSearchComponent;

  loading: boolean = false;
  noFeedbacks: boolean = false;

  //pageIndex: number = 0;
  //pageSize: number = 10;
  //currentSize: number = 0;
  length: number = 5;
  currentSearch: string;

  currentUserSubject: CurrentUser;
  chatFilter: ChatFilter;

  messages: MessageModel[] = new Array;

  dataSource: MatTableDataSource<MessageModel>;
  selection = new SelectionModel<MessageModel>(true, []);

  displayedColumns: string[] = ['select', 'fromId', 'fromName', 'toId', 'toName', 'dateSent', 'dateSeen', 'doNotDelete'];

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

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.profile.firstChange) {
      if (changes.profile.currentValue != changes.profile.previousValue) {
        this.getProfileMessages();
      }
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  pageChanged(event) {
    this.loading = true;

    let pageIndex = event.pageIndex;
    let pageSize = event.pageSize;
    let currentSize = pageSize * pageIndex;

    this.currentSearch == 'getProfileMessages' ? this.getProfileMessages(currentSize, pageIndex, pageSize) : this.getChatsByFilter(currentSize, pageIndex, pageSize);
  }

  getProfileMessages(currentSize: number = 0, pageIndex: number = 0, pageSize: number = 5) {
    this.currentSearch = 'getProfileMessages';

    this.chatService.getProfileMessages(this.profile.profileId, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.messages = new Array;

          this.messages.push(...response);

          this.length = currentSize + response.length + 1;

          this.loading = false;
        },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('ProfileChatListviewComponent.CouldNotGetMessages'), null); this.loading = false;
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
  }

  setDataSource(): void {
    this.dataSource = new MatTableDataSource(this.messages);
    this.dataSource._updateChangeSubscription();

    this.cdr.detectChanges(); // Needed to get pagination & sort working.
    this.dataSource.sort = this.sort;
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.paginator.length = this.length;
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

  // Calls to ProfileChatSearchComponent
  onSubmit() {
    this.profileChatSearchComponent.onSubmit();
    this.sidenav.close();
  }

  reset() {
    this.profileChatSearchComponent.reset();
    this.getProfileMessages();
  }

  setChatFilter(chatFilter: ChatFilter) {
    this.chatFilter = chatFilter;
    this.getChatsByFilter();
  }

  getChatsByFilter(currentSize: number = 0, pageIndex: number = 0, pageSize: number = 5) {
    this.currentSearch = 'getChatsByFilter';

    this.chatService.getChatsByFilter(this.chatFilter, pageIndex, pageSize)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => {

          this.messages = new Array;

          this.messages.push(...response);

          this.length = currentSize + response.length + 1;

          this.loading = false;
        },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('ProfileChatListviewComponent.CouldNotGetChatsByFilter'), null); this.loading = false;
        },
        () => {
          this.updateMessageList();
        }
      );
  }

  /** Allow or disallow Message Delete */
  toggleDoNotDelete() {

    const notDelete = new Array;
    const allowDelete = new Array;

    for (var _i = 0; _i < this.selection.selected.length; _i++) {

      var message = this.selection.selected[_i];

      if (message.doNotDelete) {
        allowDelete.push(message);
        message.doNotDelete = false;
      }
      else {
        notDelete.push(message);
        message.doNotDelete = true;
      }
    }

    if (notDelete.length > 0) {
      this.chatService.doNotDelete(notDelete)
        //.pipe(takeWhileAlive(this))
        .subscribe(() => { }, () => { }, () => {});
    }

    if (allowDelete.length > 0) {
      this.chatService.allowDelete(allowDelete)
        //.pipe(takeWhileAlive(this))
        .subscribe(() => { }, () => { }, () => {});
    }

    this.setDataSource();
  }

  async openMessageDialog(message: MessageModel): Promise<void> {

    const dialogRef = this.dialog.open(MessageDialog, {
      data: {
        message: message
      }
    });

    dialogRef.afterClosed().subscribe(
      res => {
        if (res === true) {
          var profileId = this.profile.profileId == message.fromId ? message.toId : message.fromId;

          // We do not want to load our own details.
          if (this.currentUserSubject.profileId != profileId) {
            this.loadDetails(profileId);
          }
        }
        else if (res == message) {
          let index = this.messages.findIndex(m => m.fromId === res.fromId && m.dateSent === res.dateSent);
          this.messages[index].doNotDelete = res.doNotDelete;

          this.setDataSource();

        }
      }
    );
  }

  // Load Detalails page
  loadDetails(profileId: string) {

    var profile: Profile;

    this.profileService.getProfileById(profileId)
      //.pipe(takeWhileAlive(this))
      .subscribe(
        (response: any) => { profile = response; this.loadProfileDetails.emit(profile); },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('ProfileChatListviewComponent.CouldNotLoadDetails'), null);
        },
        () => { }
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
