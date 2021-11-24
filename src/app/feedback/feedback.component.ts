import { KeyValue } from '@angular/common';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { CurrentUser } from '../models/currentUser';
import { Feedback } from '../models/feedback';
import { FeedbackEnum } from '../models/feedbackEnum';
import { EnumMappingService } from '../services/enumMapping.service';
import { FeedBackService } from '../services/feedback.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})

@AutoUnsubscribe()
export class FeedbackComponent {

  feedback: Feedback = new Feedback();
  feedbackForm: FormGroup;
  feedbackTypes: ReadonlyMap<string, string>;

  currentUserSubject: CurrentUser;

  loading: boolean = false;

  constructor(private enumMappings: EnumMappingService, private profileService: ProfileService, private feedBackService: FeedBackService, private formBuilder: FormBuilder, private readonly translocoService: TranslocoService) {
    this.createForm();
  }

  createForm() {
    this.feedbackForm = this.formBuilder.group({
      feedbackEnum: FeedbackEnum.Comment,
      message: null
    });
  }

  ngOnInit(): void {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject });

    this.enumMappings.feedbackTypeSubject.subscribe(value => this.feedbackTypes = value);
    this.enumMappings.updateFeedbackTypeSubject();
  }

  revert() {
    this.createForm();
  }

  prepareFeedback(): Feedback {
    const formModel = this.feedbackForm.value;

    const feedback: Feedback = {
      dateSent: null,
      dateSeen: null,
      fromProfileId: null,
      adminProfileId: null,
      feedbackType: formModel.feedbackEnum as FeedbackEnum,
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

  onSubmit() {
    this.loading = true;
    this.feedback = this.prepareFeedback();
    this.feedBackService.addFeedback(this.feedback)
      .pipe(takeWhileAlive(this))
      .subscribe(
        () => { },
        (error: any) => {
          //this.openErrorDialog(this.translocoService.translate('EditProfileComponent.CouldNotSaveUser'), null);
        },
        () => { this.feedbackForm.markAsPristine(); this.loading = false; this.createForm(); }
      );
  }

}
