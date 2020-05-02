import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './authorisation/auth/auth.service';
import { ProfileService } from './services/profile.service';

import { ChatAdapter } from 'ng-chat';
import { MyRAdapter } from './signalr/my-adapter';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'BluePenguins';
  currentTheme = 'dark-theme';
  triggeredEvents = [];

  userId: string = "offline-demo";
  username: string;

  constructor(public auth: AuthService, private profileService: ProfileService, private http: HttpClient) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }
  }

  adapter: ChatAdapter = new MyRAdapter(this.auth, 'Kurt', this.http); // Get UserName on!

  switchTheme(theme: string): void {
    this.currentTheme = theme;
  }

  onEventTriggered(event: string): void {
    this.triggeredEvents.push(event);
  }

  //joinSignalRChatRoom(): void {
  //  const userName = prompt('Please enter a user name:');

  //  this.signalRAdapter = new SignalRGroupAdapter(userName, this.http);
  //}
}
