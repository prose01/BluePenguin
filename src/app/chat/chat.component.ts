import { Component, Input, OnChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './../authorisation/auth/auth.service';
import { AppSettingsService } from '../services/appsettings.service';
import { AppSettings } from '../models/appsettings';

import { CurrentUser } from './../models/currentUser';
import { ChatAdapter } from 'ng-chat';
import { SignalRAdapter } from './signalr-adapter';


@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})

export class ChatComponent implements OnChanges {
  @Input() currentUser: CurrentUser;

  currentTheme = 'light-theme';
  triggeredEvents = [];

  userId: string;
  username: string;
  adapter: ChatAdapter;
  settings: AppSettings;

  title = 'Chats';

  constructor(public auth: AuthService, private appSettingsService: AppSettingsService, private http: HttpClient) {   
  }

  ngOnChanges(): void {
    this.appSettingsService.getSettings().subscribe(settings => this.settings = settings, () => { }, () => {
      if (this.currentUser != null) {
        setTimeout(() => { this.userId = this.currentUser.auth0Id; this.username = this.currentUser.name; }, 2000);
        setTimeout(() => { this.adapter = new SignalRAdapter(this.auth, this.settings.junoUrl, this.username, this.http); }, 2000);
      }
    });
  }

  onEventTriggered(event: string): void {
    this.triggeredEvents.push(event);
  }
}
