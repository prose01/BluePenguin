import { Component, Input, Output, EventEmitter, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';

import { MessageType } from "./../core/message-type.enum";
import { Window } from "./../core/window";
import { ChatParticipantStatus } from "./../core/chat-participant-status.enum";
import { ScrollDirection } from "./../core/scroll-direction.enum";
import { Localization } from './../core/localization';
import { IChatOption } from './../core/chat-option';
import { ChatParticipantType } from "./../core/chat-participant-type.enum";
import { IChatParticipant } from "./../core/chat-participant";
import { chatParticipantStatusDescriptor } from './../core/chat-participant-status-descriptor';
import { MessageModel } from '../../models/messageModel';
import { CurrentUser } from '../../models/currentUser';

@Component({
  selector: 'chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ChatWindowComponent {
  constructor() { }

  @Input() set currentUser(values: CurrentUser) {
    this._currentUser = values;
  }

  get currentUser(): CurrentUser {
    return this._currentUser;
  }
  
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
  public onMessagesSeen: EventEmitter<IChatParticipant> = new EventEmitter();

  @Output()
  public onMessageSent: EventEmitter<MessageModel> = new EventEmitter();

  @Output()
  public onTabTriggered: EventEmitter<{ triggeringWindow: Window, shiftKeyPressed: boolean }> = new EventEmitter();

  @Output()
  public onOptionTriggered: EventEmitter<IChatOption> = new EventEmitter();

  @Output()
  public onLoadHistoryTriggered: EventEmitter<Window> = new EventEmitter();


  @ViewChild('chatMessages') chatMessages: any;
  @ViewChild('chatWindowInput') chatWindowInput: any;
  
  private _currentUser: CurrentUser;

  // Exposes enums and functions for the template
  public ChatParticipantType = ChatParticipantType;
  public ChatParticipantStatus = ChatParticipantStatus;
  public MessageType = MessageType;
  public chatParticipantStatusDescriptor = chatParticipantStatusDescriptor;
  

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
    if (index == 0) {
      return true; // First message, good to show the thumbnail
    }
    else {
      // Check if the previous message belongs to the same user, if it belongs there is no need to show the avatar again to form the message cluster
      if (window.messages[index - 1].fromId != message.fromId) {
        return true;
      }
    }
    return false;
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
}
