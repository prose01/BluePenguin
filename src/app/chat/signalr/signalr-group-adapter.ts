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
import { ParticipantResponse } from "./../core/participant-response";
import { ChatParticipant, IChatParticipant } from "./../core/chat-participant";
import { ErrorDialog } from './../../error-dialog/error-dialog.component';
import { TranslocoService } from '@ngneat/transloco';
import { ChatParticipantType } from '../core/chat-participant-type.enum';
import { MessageModel } from '../../models/messageModel';

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
      .withUrl(`${this.junoUrl}groupchathub`, { accessTokenFactory: () => token, transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling })    // TODO: https://stackoverflow.com/questions/69633704/what-means-skipnegotiation-in-signalr-hubconnection     https://learn.microsoft.com/en-us/aspnet/core/signalr/authn-and-authz?view=aspnetcore-6.0#built-in-jwt-authentication    https://learn.microsoft.com/en-us/aspnet/core/signalr/configuration?view=aspnetcore-7.0&tabs=dotnet
      //.configureLogging(signalR.LogLevel.Debug)
      .build();

    this.hubConnection.keepAliveIntervalInMilliseconds = 150000;
    this.hubConnection.serverTimeoutInMilliseconds = 300000;

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

    this.hubConnection.on("messageReceived", (participant: ChatParticipant, message: MessageModel) => {
      // Handle the received message to ng-chat
      participant.participantType = ChatParticipantType[participant.participantType.toString()];

      this.onMessageReceived(participant, message);
    });

    this.hubConnection.on("friendsListChanged", (participantsResponse: Array<ParticipantResponse>) => {
      // Use polling for the friends list for this simple group example
      // If you want to use push notifications you will have to send filtered messages through your hub instead of using the "All" broadcast channel
      this.onFriendsListChanged(participantsResponse.filter(x => x.participant.id != this.userId));
    });

    this.hubConnection.on("updateCurrentUserSubject", () => {
      // Update CurrentUser so the bookmarks is updated and friendsList can be updated
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
    return this.http.post<ParticipantResponse[]>(`${this.junoUrl}ParticipantResponses`, { headers: this.headers });
  }

  unreadMessages(): Observable<any> {
    return this.http.post<any>(`${this.junoUrl}UnreadMessages`, { headers: this.headers });
  }

  //getMessageHistory(destinataryId: any): Observable<Message[]> {
  //  // This could be an API call to your web application that would go to the database
  //  // and retrieve a N amount of history messages between the users.
  //  return of([]);
  //}

  getMessageHistory(chatparticipant: ChatParticipant): Observable<MessageModel[]> {
    return this.http.post<MessageModel[]>(`${this.junoUrl}messagehistory`, chatparticipant, { headers: this.headers });
  }

  sendMessage(message: MessageModel): void {
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
