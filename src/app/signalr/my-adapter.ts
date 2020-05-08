import { ChatAdapter, ParticipantResponse, IChatParticipant } from 'ng-chat';
import { Observable, of } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as signalR from "@aspnet/signalr";
import { AuthService } from '../authorisation/auth/auth.service';
import { ChatMessage } from '../models/chatMessage';

export class MyRAdapter extends ChatAdapter {
  public userId: string;
  private mockedParticipants: IChatParticipant[];

  private hubConnection: signalR.HubConnection
  private static serverBaseUrl: string = 'https://localhost:44328/';  // URL to Juno web api
  private headers: HttpHeaders;

  constructor(public auth: AuthService, private username: string, private http: HttpClient) {
    super();
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

    setTimeout(() => { this.initializeConnection(this.auth.getAccessToken()); }, 1000); 
  }

  private initializeConnection(token: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${MyRAdapter.serverBaseUrl}chatHub`, { accessTokenFactory: () => token })
      .build();

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

    this.hubConnection.on("messageReceived", (participant: IChatParticipant, message: ChatMessage) => {
      // Handle the received message to ng-chat
      this.onMessageReceived(participant, message); 
    });

    this.hubConnection.on("friendsListChanged", (participantsResponse: Array<ParticipantResponse>) => {
      // Handle the received response to ng-chat
      this.onFriendsListChanged(participantsResponse.filter(x => x.participant.id != this.userId));
    });
  }

  joinRoom(): void {
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected) {
      this.hubConnection.send("join", this.username);
    }
  }

  listFriends(): Observable<ParticipantResponse[]> {
    // List connected users to show in the friends list
    // Sending the userId from the request body as this is just a demo

    this.http
      .post(`${MyRAdapter.serverBaseUrl}listFriends`, { headers: this.headers })
      .pipe(
        map((res: any) => this.mockedParticipants),
        catchError(this.handleError)
    );

    return this.http
      .post(`${MyRAdapter.serverBaseUrl}participantResponses`, { headers: this.headers })
      .pipe(
        map((res: any) => res),
        catchError(this.handleError)
    );

    //return of([]);
  }

  getMessageHistory(destinataryId: any): Observable<ChatMessage[]> {
    // This could be an API call to your web application that would go to the database
    // and retrieve a N amount of history messages between the users.

    return this.http
      .post(`${MyRAdapter.serverBaseUrl}messagehistory`, { headers: this.headers })
      .pipe(
        map((res: any) => res),
        catchError(this.handleError),
    );
  }

  sendMessage(message: ChatMessage): void {
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected)
      message.fromId = this.userId;
      this.hubConnection.send("sendMessage", message);
  }

  //groupCreated(group: Group): void {
  //  this.hubConnection.send("groupCreated", group);
  //}


  //TODO: Helper Lav en rigtig error handler inden produktion
  // https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
  // Husk at opdater GET, POST etc this.handleError!
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
