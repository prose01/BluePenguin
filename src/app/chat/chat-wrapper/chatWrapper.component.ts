import { Component, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './../../authorisation/auth/auth.service';
import { ConfigurationLoader } from "../../configuration/configuration-loader.service";

import { CurrentUser } from './../../models/currentUser';
//import { ChatAdapter } from 'ng-chat';
import { Chat } from '../../chat/chat.component';
import { SignalRAdapter } from './../signalr/signalr-adapter';
import { ProfileService } from '../../services/profile.service';
import { ChatAdapter } from './../core/chat-adapter';


@Component({
  selector: 'chatWrapper',
  templateUrl: './chatWrapper.component.html',
  styleUrls: ['./chatWrapper.component.scss'],
})

export class ChatWrapperComponent {

  private _currentUser: CurrentUser;

  private junoUrl: string;

  private currentTheme = 'light-theme';
  triggeredEvents = [];

  private username: string;

  private title = 'Chats';

  public userId: string;
  public adapter: ChatAdapter;


  @Input() set currentUser(values: CurrentUser) {
    this._currentUser = values;
    this.connectSignalRAdapter();
  }
  get currentUser(): CurrentUser {
    return this._currentUser;
  }

  constructor(public auth: AuthService, private profileService: ProfileService, private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.junoUrl = this.configurationLoader.getConfiguration().junoUrl;
  }

  private connectSignalRAdapter(): void {
    if (this.currentUser != null) {
      setTimeout(() => { this.userId = this.currentUser.profileId; this.username = this.currentUser.name; }, 2000);
      setTimeout(() => { this.adapter = new SignalRAdapter(this.auth, this.profileService, this.junoUrl, this.username, this.http); }, 2000);
    }
  }

  onEventTriggered(event: string): void {
    this.triggeredEvents.push(event);
  }
}
