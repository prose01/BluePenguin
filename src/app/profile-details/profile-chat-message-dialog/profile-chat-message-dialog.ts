import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { ChatService } from '../../services/chat.service';
import { MessageModel } from '../../models/messageModel';

@Component({
  selector: 'message-dialog',
  templateUrl: './profile-chat-message-dialog.html',
  styleUrls: ['./profile-chat-message-dialog.scss']
})

export class MessageDialog implements OnDestroy {

  private subs: Subscription[] = [];
  public message: MessageModel;

  constructor(public dialogRef: MatDialogRef<MessageDialog>, private chatService: ChatService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.message = this.data.message;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  loadDetailsClick(): void {
    this.dialogRef.close(true);
  }

  private doNotDelete(): void {
    let messages = new Array;
    messages.push(this.message);

    this.subs.push(
      this.chatService.doNotDelete(messages)
      .subscribe({
        next: () =>  {},
        complete: () => {},
        error: () => {}
      })
    );

    this.message.doNotDelete = true;
    this.dialogRef.close(this.message);
  }

  private allowDelete(): void {
    let messages = new Array;
    messages.push(this.message);

    this.subs.push(
      this.chatService.allowDelete(messages)
      .subscribe({
        next: () =>  {},
        complete: () => {},
        error: () => {}
      })
    );

    this.message.doNotDelete = false;
    this.dialogRef.close(this.message);
  }
}
