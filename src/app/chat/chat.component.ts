import { Component, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './../authorisation/auth/auth.service';
import { ConfigurationLoader } from "../configuration/configuration-loader.service";

import { CurrentUser } from './../models/currentUser';
import { ChatAdapter } from 'ng-chat';
import { SignalRAdapter } from './signalr-adapter';


@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})

export class ChatComponent implements OnChanges {
  @Input() currentUser: CurrentUser;

  private junoUrl: string;

  currentTheme = 'light-theme';
  triggeredEvents = [];

  userId: string;
  username: string;
  adapter: ChatAdapter;

  title = 'Chats';

  constructor(public auth: AuthService, private configurationLoader: ConfigurationLoader, private http: HttpClient) {
    this.junoUrl = this.configurationLoader.getConfiguration().junoUrl; 
  }

  ngOnChanges(): void {
    if (this.currentUser != null) {
      setTimeout(() => { this.userId = this.currentUser.profileId; this.username = this.currentUser.name; }, 2000); // TODO: Change userId from auth0Id to ProfileId.
      setTimeout(() => { this.adapter = new SignalRAdapter(this.auth, this.junoUrl, this.username, this.http); }, 2000);
    }
  }

  onEventTriggered(event: string): void {
    this.triggeredEvents.push(event);
  }
}
