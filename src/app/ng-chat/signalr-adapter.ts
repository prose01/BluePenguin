//import { ChatAdapter, Message, ParticipantResponse, IChatParticipant } from 'ng-chat';
import { Chat } from '../chat/chat.component';
import { Message } from '../chat/core/message';
import { ParticipantResponse } from '../chat/core/participant-response';
import { IChatParticipant } from '../chat/core/chat-participant';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import * as signalR from "@microsoft/signalr";
import { AuthService } from '../authorisation/auth/auth.service';
import { CurrentUser } from '../models/currentUser';
import { ProfileService } from '../services/profile.service';

export class SignalRAdapter extends Chat {
  public userId: string;

  private hubConnection: signalR.HubConnection
  private headers: HttpHeaders;
  private currentUserSubject: CurrentUser;

  constructor(public auth: AuthService, private profileService: ProfileService, private junoUrl: string, private username: string, private http: HttpClient) {
    super(http);
    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    setTimeout(() => { this.initializeConnection(this.auth.getAccessToken()); }, 1000); 
  }

  private initializeConnection(token: string): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.junoUrl}chatHub`, { accessTokenFactory: () => token })
      .build();

    this.hubConnection.keepAliveIntervalInMilliseconds = 15;
    this.hubConnection.serverTimeoutInMilliseconds = 30;

    this.hubConnection.on('UserIsOnline', userId => {
      console.log(userId + ' has connected');
    })

    this.hubConnection
      .start()
      .then(() => {
        this.joinRoom();

        this.initializeListeners();
      })
      .catch(err => console.log(`Error while starting SignalR connection: ${err}`));

    this.hubConnection.on('UserIsOffline', userId => {
      console.log(userId + ' has disconnected');
    })
  }

  private initializeListeners(): void {
    this.hubConnection.on("generatedUserId", (userId) => {
      // With the userId set the chat will be rendered
      this.userId = userId;
    });

    this.hubConnection.on("messageReceived", (participant: IChatParticipant, message: Message) => {
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
    return this.http
      .post<ParticipantResponse[]>(`${this.junoUrl}ParticipantResponses`, this.currentUserSubject, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
    );
  }

  getMessageHistory(destinataryId: string): Observable<Message[]> {
    return this.http
      .post(`${this.junoUrl}messagehistory`, '"' + destinataryId + '"', { headers: this.headers })
      .pipe(
        map((res: Message[]) => res),
        catchError(this.handleError),
    );
  }

  sendMessage(message: Message): void {
    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected)
      this.hubConnection.send("sendMessage", message);
  }


  //TODO: Helper Lav en rigtig error handler inden produktion
  // https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
  // Husk at opdater GET, POST etc this.handleError!
  //private handleError(error: any): Promise<any> {
  //  console.error('An error occurred', error); // for demo purposes only
  //  return Promise.reject(error.message || error);
  //}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('No connection to chat server:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
