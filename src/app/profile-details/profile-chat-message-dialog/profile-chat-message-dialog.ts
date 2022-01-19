import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { ChatService } from '../../services/chat.service';
import { MessageModel } from '../../models/messageModel';

@Component({
  selector: 'message-dialog',
  templateUrl: './profile-chat-message-dialog.html',
  styleUrls: ['./profile-chat-message-dialog.scss']
})

@AutoUnsubscribe()
export class MessageDialog {

  message: MessageModel;

  constructor(public dialogRef: MatDialogRef<MessageDialog>, private chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.message = this.data.message;
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  loadDetailsClick(): void {
    this.dialogRef.close(true);
  }

  doNotDelete() {
    let messages = new Array;
    messages.push(this.message);

    this.chatService.doNotDelete(messages)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => { });

    this.message.doNotDelete = true;
    this.dialogRef.close(this.message);
  }

  allowDelete() {
    let messages = new Array;
    messages.push(this.message);

    this.chatService.allowDelete(messages)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => { });

    this.message.doNotDelete = false;
    this.dialogRef.close(this.message);
  }
}
