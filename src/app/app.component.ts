import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './authorisation/auth/auth.service';
import { ProfileService } from './services/profile.service';

import { ChatAdapter } from 'ng-chat';
import { MyRAdapter } from './signalr/my-adapter';
import { SignalRAdapter } from './signalr/signalr-adapter';
import { SignalRGroupAdapter } from './signalr/signalr-group-adapter';
import { DemoAdapter } from './signalr/demo-adapter';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'BluePenguins';
  currentTheme = 'dark-theme';
  triggeredEvents = [];
  fileUploadUrl: string = `${SignalRAdapter.serverBaseUrl}UploadFile`;
  signalRAdapter: SignalRGroupAdapter;

  userId: string = "offline-demo";
  username: string;

  constructor(public auth: AuthService, private profileService: ProfileService, private http: HttpClient) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      this.auth.renewTokens();
    }

    //this.signalRAdapter = new SignalRGroupAdapter('Hans', this.http);
    //this.joinSignalRChatRoom();
  }

  //adapter: ChatAdapter = new DemoAdapter();
  adapter: ChatAdapter = new MyRAdapter('Kurt', this.http);

  switchTheme(theme: string): void {
    this.currentTheme = theme;
  }

  onEventTriggered(event: string): void {
    this.triggeredEvents.push(event);
  }

  joinSignalRChatRoom(): void {
    const userName = prompt('Please enter a user name:');

    this.signalRAdapter = new SignalRGroupAdapter(userName, this.http);
  }
}
