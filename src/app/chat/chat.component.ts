import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './../authorisation/auth/auth.service';

import { CurrentUser } from './../models/currentUser';
import { ChatAdapter } from 'ng-chat';
import { SignalRAdapter } from './signalr-adapter';


@Component({
  selector: 'chat-component',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})

export class ChatComponent implements OnInit {
  @Input() currentUser: CurrentUser;

  currentTheme = 'light-theme';
  triggeredEvents = [];

  userId: string;
  username: string;
  adapter: ChatAdapter;

  constructor(public auth: AuthService, private http: HttpClient) {
    setTimeout(() => { this.userId = this.currentUser.auth0Id; this.username = this.currentUser.name; }, 2000);
  }

  ngOnInit(): void {
    setTimeout(() => { this.adapter = new SignalRAdapter(this.auth, this.username, this.http); }, 2000);
  }

  onEventTriggered(event: string): void {
    this.triggeredEvents.push(event);
  }
}
