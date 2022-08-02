import { Component, OnDestroy, OnInit } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Subscription } from 'rxjs';

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

export class FeedbackComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  public feedback: Feedback = new Feedback();
  public feedbackForm: FormGroup;
  public feedbackTypes: ReadonlyMap<string, string>;

  public loading: boolean = false;

  constructor(private enumMappings: EnumMappingService, private feedBackService: FeedBackService, private formBuilder: FormBuilder, private dialog: MatDialog, private readonly translocoService: TranslocoService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.subs.push(
      this.enumMappings.feedbackTypeSubject.subscribe(value => this.feedbackTypes = value)
    );
    this.enumMappings.updateFeedbackTypeSubject();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private createForm(): void {
    this.feedbackForm = this.formBuilder.group({
      feedbackType: FeedbackType.Comment,
      message: null
    });
  }

  revert(): void {
    this.createForm();
  }

  private prepareFeedback(): Feedback {
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

  private openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.feedback = this.prepareFeedback();
    this.subs.push(
      this.feedBackService.addFeedback(this.feedback)
      .subscribe({
        next: () =>  {},
        complete: () => {
          this.feedbackForm.markAsPristine(); this.loading = false; this.createForm();
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.Thanks'), null); 
        },
        error: () => {
          this.openErrorDialog(this.translocoService.translate('FeedbackComponent.CouldNotSendFeedback'), null); this.loading = false;
        }
      })
    );
  }

}
