import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { Feedback } from '../../models/feedback';
import { FeedBackService } from '../../services/feedback.service';

@Component({
  selector: 'feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})

//@AutoUnsubscribe()
export class FeedbackDialog {

  feedback: Feedback;

  constructor(public dialogRef: MatDialogRef<FeedbackDialog>, private feedBackService: FeedBackService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.feedback = this.data.feedback;
  }

  onCloseClick(): void {
    this.dialogRef.close(false);
  }

  loadDetailsClick(): void {
    this.dialogRef.close(true);
  }

  toggleFeedbackStatus() {
    this.feedback.open = this.feedback.open ? false : true;
    this.dialogRef.close(this.feedback);
  }

  openFeedbacks() {
    let feedbackIds = new Array;
    feedbackIds.push(this.feedback.feedbackId);

    this.feedBackService.openFeedbacks(feedbackIds)
      //.pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => { });

    this.feedback.open = true;
    this.dialogRef.close(this.feedback);
  }

  closeFeedbacks() {
    let feedbackIds = new Array;
    feedbackIds.push(this.feedback.feedbackId);

    this.feedBackService.closeFeedbacks(feedbackIds)
      //.pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => { });

    this.feedback.open = false;
    this.dialogRef.close(this.feedback);
  }
}
