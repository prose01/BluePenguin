import { Component, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { AuthService } from './../../authorisation/auth/auth.service';
import { ConfigurationLoader } from "../../configuration/configuration-loader.service";

import { CurrentUser } from './../../models/currentUser';
//import { ChatAdapter } from 'ng-chat';
import { Chat } from '../../chat/chat.component';
import { SignalRAdapter } from './../signalr/signalr-adapter';
import { SignalRGroupAdapter } from './../signalr/signalr-group-adapter';
import { ProfileService } from '../../services/profile.service';
import { ChatAdapter } from './../core/chat-adapter';
import { IChatController } from '../core/chat-controller';
import { TranslocoService } from '@ngneat/transloco';


@Component({
  selector: 'chatWrapper',
  templateUrl: './chatWrapper.component.html'
})

export class ChatWrapperComponent implements OnInit, OnDestroy {

  @ViewChild('ngChatInstance')
  protected ngChatInstance: IChatController;

  private _currentUser: CurrentUser;

  private junoUrl: string;

  private currentTheme = 'light-theme';
  triggeredEvents = [];

  private username: string;

  private chatTitle: string;
  private searchPlaceholder: string;
  private messagePlaceholder: string;
  private browserNotificationTitle: string;
  private loadMessageHistoryPlaceholder: string;

  public userId: string;
  public adapter: ChatAdapter;

  private subs: Subscription[] = [];

  @Input() set currentUser(values: CurrentUser) {
    this._currentUser = values;
    this.connectSignalRAdapter();
  }

  get currentUser(): CurrentUser {
    return this._currentUser;
  }

  constructor(public auth: AuthService, private profileService: ProfileService, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private http: HttpClient, private readonly translocoService: TranslocoService) {
    this.junoUrl = this.configurationLoader.getConfiguration().junoUrl;
  }

  ngOnInit() {
    this.subs.push(
      this.translocoService.selectTranslate('ChatTitle').subscribe(value => this.chatTitle = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('Search').subscribe(value => this.searchPlaceholder = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('messagePlaceholder').subscribe(value => this.messagePlaceholder = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('browserNotificationTitle').subscribe(value => this.browserNotificationTitle = value)
    );
    this.subs.push(
      this.translocoService.selectTranslate('loadMessageHistoryPlaceholder').subscribe(value => this.loadMessageHistoryPlaceholder = value)
    );
  }

  private connectSignalRAdapter(): void {
    if (this.currentUser != null) {
      setTimeout(() => { this.userId = this.currentUser.profileId; this.username = this.currentUser.name; }, 2000);
      setTimeout(() => { this.adapter = new SignalRGroupAdapter(this.auth, this.profileService, this.dialog, this.junoUrl, this.username, this.http, this.translocoService); }, 2000);
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  onEventTriggered(event: string): void {
    this.triggeredEvents.push(event);
  }

  logOut() {
    this.ngChatInstance.callIsDisabled();
  }
}
