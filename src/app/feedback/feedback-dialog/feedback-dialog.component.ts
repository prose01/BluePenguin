import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { Feedback } from '../../models/feedback';
import { FeedBackService } from '../../services/feedback.service';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'feedback-dialog',
  templateUrl: './feedback-dialog.component.html',
  styleUrls: ['./feedback-dialog.component.scss']
})

export class FeedbackDialog implements OnDestroy {

  private subs: Subscription[] = [];
  public feedback: Feedback;

  constructor(public dialogRef: MatDialogRef<FeedbackDialog>, private feedBackService: FeedBackService, private dialog: MatDialog, private readonly translocoService: TranslocoService,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.feedback = this.data.feedback;
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

  private toggleFeedbackStatus(): void {
    this.feedback.open = this.feedback.open ? false : true;
    this.dialogRef.close(this.feedback);
  }

  private openFeedbacks(): void {
    let feedbackIds = new Array;
    feedbackIds.push(this.feedback.feedbackId);

    this.subs.push(
      this.feedBackService.openFeedbacks(feedbackIds)
      .subscribe({
        next: () =>  {},
        complete: () => {},
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotOpenFeedbacks'), null);
        }
      })
    );

    this.feedback.open = true;
    this.dialogRef.close(this.feedback);
  }

  private closeFeedbacks(): void {
    let feedbackIds = new Array;
    feedbackIds.push(this.feedback.feedbackId);

    this.subs.push(
      this.feedBackService.closeFeedbacks(feedbackIds)
      .subscribe({
        next: () =>  {},
        complete: () => {},
        error: () => {
          this.openErrorDialog(this.translocoService.translate('CouldNotCloseFeedbacks'), null);
        }
      })
    );

    this.feedback.open = false;
    this.dialogRef.close(this.feedback);
  }

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }
}
