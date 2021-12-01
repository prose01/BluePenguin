import { Component, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Feedback } from '../models/feedback';
import { FeedbackType } from '../models/feedbackType';
import { ErrorDialog } from '../error-dialog/error-dialog.component';

import { FeedBackService } from '../services/feedback.service';
import { EnumMappingService } from '../services/enumMapping.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})

@AutoUnsubscribe()
export class FeedbackComponent implements OnInit {

  feedback: Feedback = new Feedback();
  feedbackForm: FormGroup;
  feedbackTypes: ReadonlyMap<string, string>;

  loading: boolean = false;

  constructor(private enumMappings: EnumMappingService, private feedBackService: FeedBackService, private formBuilder: FormBuilder, private dialog: MatDialog, private readonly translocoService: TranslocoService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.enumMappings.feedbackTypeSubject.subscribe(value => this.feedbackTypes = value);
    this.enumMappings.updateFeedbackTypeSubject();
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      feedbackType: FeedbackType.Comment,
      message: null
    });
  }

  revert() {
    this.createForm();
  }

  prepareFeedback(): Feedback {
    const formModel = this.feedbackForm.value;

    const feedback: Feedback = {
      feedbackId: null,
      dateSent: null,
      dateSeen: null,
      fromProfileId: null,
      fromName: null,
      adminProfileId: null,
      adminName: null,
      feedbackType: formModel.feedbackType as FeedbackType,
      message: formModel.message as string,
      open: true,
      countrycode: null,
      languagecode: null
    };

    return feedback;
  }

  // Preserve original EnumMapping order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }

  onSubmit() {
    this.loading = true;
    this.feedback = this.prepareFeedback();
    this.feedBackService.addFeedback(this.feedback)
      .pipe(takeWhileAlive(this))
      .subscribe(
        () => { },
        (error: any) => {
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null); this.loading = false;
        },
        () => { this.feedbackForm.markAsPristine(); this.loading = false; this.createForm(); }
      );
  }

}
