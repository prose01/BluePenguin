//import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
//import { MatDialog } from '@angular/material/dialog';
//import { Observable } from 'rxjs';

//import * as signalR from "@microsoft/signalr";
//import { AuthService } from '../../authorisation/auth/auth.service';
//import { CurrentUser } from '../../models/currentUser';
//import { ProfileService } from '../../services/profile.service';
//import { Chat } from '../../chat/chat.component';
//import { Message } from '../../chat/core/message';
//import { ParticipantResponse } from '../../chat/core/participant-response';
//import { IChatParticipant } from '../../chat/core/chat-participant';
//import { ChatAdapter } from './../core/chat-adapter';
//import { ErrorDialog } from './../../error-dialog/error-dialog.component';
//import { TranslocoService } from '@ngneat/transloco';

//export class SignalRAdapter extends ChatAdapter {
//  public userId: string;

//  private hubConnection: signalR.HubConnection
//  private headers: HttpHeaders;
//  private currentUserSubject: CurrentUser;

//  constructor(public auth: AuthService, private profileService: ProfileService, private dialog: MatDialog, private junoUrl: string, private username: string, private http: HttpClient, private readonly translocoService: TranslocoService) {
//    super();
//    this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject);
//    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
//    setTimeout(() => { this.initializeConnection(this.auth.getAccessToken()); }, 1000); 
//  }

//  private initializeConnection(token: string): void {
//    this.hubConnection = new signalR.HubConnectionBuilder()
//      .withUrl(`${this.junoUrl}chatHub`, { accessTokenFactory: () => token })
//      .build();

//    this.hubConnection.keepAliveIntervalInMilliseconds = 15;
//    this.hubConnection.serverTimeoutInMilliseconds = 30;

//    this.hubConnection
//      .start()
//      .then(() => {
//        this.joinRoom();

//        this.initializeListeners();
//      })
//      .catch(error  => {
//        this.openErrorDialog(this.translocoService.translate('ErrorStartingConnection'), null);
//        }
//      );
//  }

//  private initializeListeners(): void {
//    this.hubConnection.on("generatedUserId", (userId) => {
//      // With the userId set the chat will be rendered
//      this.userId = userId;
//    });

//    this.hubConnection.on("messageReceived", (participant: IChatParticipant, message: Message) => {
//      // Handle the received message to ng-chat
//      this.onMessageReceived(participant, message); 
//    });

//    this.hubConnection.on("friendsListChanged", (participantsResponse: Array<ParticipantResponse>) => {
//      // Handle the received response to ng-chat
//      this.onFriendsListChanged(participantsResponse.filter(x => x.participant.id != this.userId));
//    });
//  }

//  joinRoom(): void {
//    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected) {
//      this.hubConnection.send("join", this.username);
//    }
//  }

//  listFriends(): Observable<ParticipantResponse[]> {
//    // List connected users to show in the friends list
//    return this.http.post<ParticipantResponse[]>(`${this.junoUrl}ParticipantResponses`, this.currentUserSubject, { headers: this.headers });
//  }

//  getMessageHistory(destinataryId: string): Observable<Message[]> {
//    return this.http.post<Message[]>(`${this.junoUrl}messagehistory`, '"' + destinataryId + '"', { headers: this.headers });
//  }

//  sendMessage(message: Message, chatparticipant: IChatParticipant): void {
//    message.participantType = chatparticipant.participantType;
//    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected)
//      this.hubConnection.send("sendMessage", message);
//  }

//  onDisconnectedAsync(): void {
//    if (this.hubConnection && this.hubConnection.state == signalR.HubConnectionState.Connected)
//      this.hubConnection.send("onDisconnectedAsync", null);
//  }

//  private openErrorDialog(title: string, error: any): void {
//    const dialogRef = this.dialog.open(ErrorDialog, {
//      data: {
//        title: title,
//        content: error?.error
//      }
//    });
//  }
//}
