import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import * as signalR from "@microsoft/signalr";
import { AuthService } from '../../authorisation/auth/auth.service';
import { CurrentUser } from '../../models/currentUser';
import { ProfileService } from '../../services/profile.service';
import { ChatAdapter } from './../core/chat-adapter';
import { IChatGroupAdapter } from './../core/chat-group-adapter';
import { Group } from "./../core/group";
import { Message } from "./../core/message";
import { ParticipantResponse } from "./../core/participant-response";
import { ChatParticipant, IChatParticipant } from "./../core/chat-participant";
import { ErrorDialog } from './../../error-dialog/error-dialog.component';
import { TranslocoService } from '@ngneat/transloco';

export class SignalRGroupAdapter extends ChatAdapter implements IChatGroupAdapter {
  public userId: string;

  private hubConnection: signalR.HubConnection
  private headers: HttpHeaders;
  private currentUserSubject: CurrentUser;
  //public static serverBaseUrl: string = 'https://ng-chat-api.azurewebsites.net/'; // Set this to 'https://localhost:5001/' if running locally

  constructor(public auth: AuthService, private profileService: ProfileService, private dialog: MatDialog, private junoUrl: string, private username: string, private http: HttpClient, private readonly translocoService: TranslocoService) {
    super();
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    setTimeout(() => { this.initializeConnection(this.auth.getAccessToken()); }, 1000);
  }

  private initializeConnection(token: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.junoUrl}groupchathub`, { accessTokenFactory: () => token })
      .build();

    this.hubConnection.keepAliveIntervalInMilliseconds = 15;
    this.hubConnection.serverTimeoutInMilliseconds = 30;

    this.hubConnection
      .start()
      .then(() => {
        this.joinRoom();

        this.initializeListeners();
      })
      .catch(err => console.log(`Error while starting SignalR connection: ${err}`));
  }

  private initializeListeners(): void {
    this.hubConnection.on("generatedUserId", (userId) => {
      // With the userId set the chat will be rendered
      this.userId = userId;
    });

    this.hubConnection.on("messageReceived", (participant, message) => {
      // Handle the received message to ng-chat
      this.onMessageReceived(participant, message);
    });

    this.hubConnection.on("friendsListChanged", (participantsResponse: Array<ParticipantResponse>) => {
      // Use polling for the friends list for this simple group example
      // If you want to use push notifications you will have to send filtered messages through your hub instead of using the "All" broadcast channel
      this.onFriendsListChanged(participantsResponse.filter(x => x.participant.id != this.userId));
    });

    this.hubConnection.on("updateCurrentUserSubject", () => {
      // Update CurrentUser so the Chatmemberlist is updated and friendsList can be updated
      this.profileService.updateCurrentUserSubject();
    });
  }

  joinRoom(): void {
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected) {
      this.hubConnection.send("join");
    }
  }

  //listFriends(): Observable<ParticipantResponse[]> {
  //  // List connected users to show in the friends list
  //  // Sending the userId from the request body as this is just a demo
  //  return this.http
  //    .post(`${SignalRGroupAdapter.serverBaseUrl}listFriends`, { currentUserId: this.userId })
  //    .pipe(
  //      map((res: any) => res),
  //      catchError((error: any) => Observable.throw(error.error || 'Server error'))
  //    );
  //}

  listFriends(): Observable<ParticipantResponse[]> {
    // List connected users to show in the friends list
    return this.http.post<ParticipantResponse[]>(`${this.junoUrl}ParticipantResponses`, this.currentUserSubject, { headers: this.headers });
  }

  //getMessageHistory(destinataryId: any): Observable<Message[]> {
  //  // This could be an API call to your web application that would go to the database
  //  // and retrieve a N amount of history messages between the users.
  //  return of([]);
  //}

  getMessageHistory(chatparticipant: ChatParticipant): Observable<Message[]> {
    return this.http.post<Message[]>(`${this.junoUrl}messagehistory`, chatparticipant, { headers: this.headers });
  }

  sendMessage(message: Message, chatparticipant: ChatParticipant): void {
    message.participantType = chatparticipant.participantType;
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected)
      this.hubConnection.send("sendMessage", message);
  }

  groupCreated(group: Group): void {
    this.hubConnection.send("groupCreated", group);
  }

  onDisconnectedAsync(): void {
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected)
      //this.hubConnection.send("onDisconnectedAsync", null);
      this.hubConnection.stop();
  }

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    })
  }

}
