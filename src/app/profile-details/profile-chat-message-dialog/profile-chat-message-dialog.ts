import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { MessageModel } from '../../models/messageModel';

@Component({
  selector: 'message-dialog',
  templateUrl: './profile-chat-message-dialog.html',
  styleUrls: ['./profile-chat-message-dialog.scss']
})

export class MessageDialog {

  message: MessageModel;

  constructor(public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.message = this.data.message;
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  loadDetailsClick(): void {
    this.dialogRef.close(true);
  }
}
