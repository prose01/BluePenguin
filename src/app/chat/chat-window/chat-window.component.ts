import { Component, Input, Output, OnInit, EventEmitter, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import { MessageType } from "./../core/message-type.enum";
import { Window } from "./../core/window";
import { ChatParticipantStatus } from "./../core/chat-participant-status.enum";
import { ScrollDirection } from "./../core/scroll-direction.enum";
import { Localization } from './../core/localization';
import { IFileUploadAdapter } from './../core/file-upload-adapter';
import { IChatOption } from './../core/chat-option';
import { Group } from "./../core/group";
import { ChatParticipantType } from "./../core/chat-participant-type.enum";
import { IChatParticipant } from "./../core/chat-participant";
import { MessageCounter } from "./../core/message-counter";
import { chatParticipantStatusDescriptor } from './../core/chat-participant-status-descriptor';
import { MessageModel } from '../../models/messageModel';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatWindowComponent implements OnInit {
  constructor() { }

  @Input()
  public fileUploadAdapter: IFileUploadAdapter;

  @Input()
  public window: Window;

  @Input()
  public userId: any;

  @Input()
  public localization: Localization;

  @Input()
  public showOptions: boolean;

  @Input()
  public emojisEnabled: boolean = true;

  @Input()
  public linkfyEnabled: boolean = false;

  @Input()
  public showMessageDate: boolean = true;

  @Input()
  public messageDatePipeFormat: string = "short";

  @Input()
  public hasPagedHistory: boolean = true;

  @Output()
  public onChatWindowClosed: EventEmitter<{ closedWindow: Window, closedViaEscapeKey: boolean }> = new EventEmitter();

  @Output()
  public onMessagesSeen: EventEmitter<MessageModel[]> = new EventEmitter();

  @Output()
  public onMessageSent: EventEmitter<MessageModel> = new EventEmitter();

  @Output()
  public onTabTriggered: EventEmitter<{ triggeringWindow: Window, shiftKeyPressed: boolean }> = new EventEmitter();

  @Output()
  public onOptionTriggered: EventEmitter<IChatOption> = new EventEmitter();

  @Output()
  public onLoadHistoryTriggered: EventEmitter<Window> = new EventEmitter();

  public initials: string;
  public initialsColour: string;
  public circleColour: string;
  private showInitials: boolean = true;

  @ViewChild('chatMessages') chatMessages: any;
  @ViewChild('nativeFileInput') nativeFileInput: ElementRef;
  @ViewChild('chatWindowInput') chatWindowInput: any;

  // File upload state
  public fileUploadersInUse: string[] = []; // Id bucket of uploaders in use

  // Exposes enums and functions for the template
  public ChatParticipantType = ChatParticipantType;
  public ChatParticipantStatus = ChatParticipantStatus;
  public MessageType = MessageType;
  public chatParticipantStatusDescriptor = chatParticipantStatusDescriptor;

  ngOnInit() {
    this.initials = this.window.participant.initials;
    this.initialsColour = this.window.participant.initialsColour;
    this.circleColour = this.window.participant.circleColour;

    // TODO: This is the getChatWindowAvatar code that sets Avatar for User or Group. We need to add Group at some point.
    //if (this.window.participant.participantType == ChatParticipantType.User) {
    //  this.initials = this.window.participant.initials;
    //  this.circleColour = this.window.participant.circleColour;
    //}
    //else if (this.window.participant.participantType == ChatParticipantType.Group) {
    //  let group = this.window.participant as Group;
    //  let userIndex = group.chattingTo.findIndex(x => x.id == message.fromId);

    //  //this.initials = participant.initials; // TODO: Add correct data for group participant
    //  //this.circleColour = participant.circleColour; // TODO: Add correct data for group participant

    //  return group.chattingTo[userIndex >= 0 ? userIndex : 0].avatar;
    //}
  }

  defaultWindowOptions(currentWindow: Window): IChatOption[] {
    if (this.showOptions && currentWindow.participant.participantType == ChatParticipantType.User) {
      return [{
        isActive: false,
        chattingTo: currentWindow,
        validateContext: (participant: IChatParticipant) => {
          return participant.participantType == ChatParticipantType.User;
        },
        displayLabel: 'Add People' // TODO: Localize this
      }];
    }

    return [];
  }

  // Asserts if a user avatar is visible in a chat cluster
  isAvatarVisible(window: Window, message: MessageModel, index: number): boolean {
    if (message.fromId != this.userId) {
      if (index == 0) {
        return true; // First message, good to show the thumbnail
      }
      else {
        // Check if the previous message belongs to the same user, if it belongs there is no need to show the avatar again to form the message cluster
        if (window.messages[index - 1].fromId != message.fromId) {
          return true;
        }
      }
    }
    console.log('isAvatarVisible');
    console.log('index ' + index);
    return false;
  }

  isUploadingFile(window: Window): boolean {
    const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);

    return this.fileUploadersInUse.indexOf(fileUploadInstanceId) > -1;
  }

  // Generates a unique file uploader id for each participant
  getUniqueFileUploadInstanceId(window: Window): string {
    if (window && window.participant) {
      return `chat-file-upload-${window.participant.id}`;
    }

    return 'chat-file-upload';
  }

  // Scrolls a chat window message flow to the bottom
  scrollChatWindow(window: Window, direction: ScrollDirection): void {
    if (!window.isCollapsed) {
      setTimeout(() => {
        if (this.chatMessages) {
          let element = this.chatMessages.nativeElement;
          let position = (direction === ScrollDirection.Top) ? 0 : element.scrollHeight;
          element.scrollTop = position;
        }
      });
    }
  }

  activeOptionTrackerChange(option: IChatOption): void {
    this.onOptionTriggered.emit(option);
  }

  // Triggers native file upload for file selection from the user
  triggerNativeFileUpload(window: Window): void {
    if (window) {
      if (this.nativeFileInput) this.nativeFileInput.nativeElement.click();
    }
  }

  // Toggles a window focus on the focus/blur of a 'newMessage' input
  toggleWindowFocus(window: Window): void {
    window.hasFocus = !window.hasFocus;
  }

  fetchMessageHistory(window: Window): void {
    this.onLoadHistoryTriggered.emit(window);
  }

  // Closes a chat window via the close 'X' button
  onCloseChatWindow(): void {
    this.onChatWindowClosed.emit({ closedWindow: this.window, closedViaEscapeKey: false });
  }

  /*  Monitors pressed keys on a chat window
      - Dispatches a message when the ENTER key is pressed
      - Tabs between windows on TAB or SHIFT + TAB
      - Closes the current focused window on ESC
  */
  onChatInputTyped(event: any, window: Window): void {
    switch (event.keyCode) {
      case 13:
        if (window.newMessage && window.newMessage.trim() != "") {
          let message = new MessageModel();

          message.fromId = this.userId;
          message.toId = window.participant.id;
          message.message = window.newMessage;
          message.dateSent = new Date();
          message.participantType = window.participant.participantType;

          window.messages.push(message);

          this.onMessageSent.emit(message);

          window.newMessage = ""; // Resets the new message input

          this.scrollChatWindow(window, ScrollDirection.Bottom);
        }
        break;
      case 9:
        event.preventDefault();

        this.onTabTriggered.emit({ triggeringWindow: window, shiftKeyPressed: event.shiftKey });

        break;
      case 27:
        this.onChatWindowClosed.emit({ closedWindow: window, closedViaEscapeKey: true });

        break;
    }
  }

  // Toggles a chat window visibility between maximized/minimized
  onChatWindowClicked(window: Window): void {
    window.isCollapsed = !window.isCollapsed;
    this.scrollChatWindow(window, ScrollDirection.Bottom);
  }

  private clearInUseFileUploader(fileUploadInstanceId: string): void {
    const uploaderInstanceIdIndex = this.fileUploadersInUse.indexOf(fileUploadInstanceId);

    if (uploaderInstanceIdIndex > -1) {
      this.fileUploadersInUse.splice(uploaderInstanceIdIndex, 1);
    }
  }

  // Handles file selection and uploads the selected file using the file upload adapter
  onFileChosen(window: Window): void {
    const fileUploadInstanceId = this.getUniqueFileUploadInstanceId(window);
    const uploadElementRef = this.nativeFileInput;

    if (uploadElementRef) {
      const file: File = uploadElementRef.nativeElement.files[0];

      this.fileUploadersInUse.push(fileUploadInstanceId);

      this.fileUploadAdapter.uploadFile(file, window.participant.id)
        .subscribe(message => {
          this.clearInUseFileUploader(fileUploadInstanceId);

          message.fromId = this.userId;

          // Push file message to current user window   
          window.messages.push(message);

          //this.onMessageSent.emit(message);// Probably wrong but we do not send files anyway.
          this.onMessageSent.emit(message);

          this.scrollChatWindow(window, ScrollDirection.Bottom);

          // Resets the file upload element
          uploadElementRef.nativeElement.value = '';
        }, (error) => {
          this.clearInUseFileUploader(fileUploadInstanceId);

          // Resets the file upload element
          uploadElementRef.nativeElement.value = '';

          // TODO: Invoke a file upload adapter error here
        });
    }
  }
}
