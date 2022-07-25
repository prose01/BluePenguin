import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

import { EnumMappingService } from '../../services/enumMapping.service';
import { ProfileService } from '../../services/profile.service';
import { BehaviorSubjectService } from '../../services/behaviorSubjec.service';
import { CurrentUser } from '../../models/currentUser';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { KeyValue } from '@angular/common';
import { FeedbackFilter } from '../../models/feedbackFilter';
import { FeedbackType } from '../../models/feedbackType';
import { Feedback } from '../../models/feedback';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'feedback-search',
  templateUrl: './feedback-search.component.html'
})

export class FeedbackSearchComponent implements OnInit, OnDestroy {

  public loading: boolean = false;

  public filter: FeedbackFilter = new FeedbackFilter();
  public feedbackForm: FormGroup;
  private searchResultFeedbacks: Feedback[];
  private feedbackId: string;
  private dateSentStart: Date;
  private dateSentEnd: Date;
  private dateSeenStart: Date;
  private dateSeenEnd: Date;
  private fromProfileId: string;
  private fromName: string;
  private adminProfileId: string;
  private adminName: string;
  public feedbackTypes: ReadonlyMap<string, string>;
  private message: string;
  public open: boolean;
  private countrycode: string;
  private languagecode: string;

  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;

  public languageList: string[] = [];
  public countryList: string[] = [];

  @Output() getFeedbacksByFilter = new EventEmitter<FeedbackFilter>();

  constructor(private enumMappings: EnumMappingService, private profileService: ProfileService, private behaviorSubjectService: BehaviorSubjectService, private formBuilder: FormBuilder, private dateAdapter: DateAdapter<Date>, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {

    this.languageList = this.configurationLoader.getConfiguration().languageList;
    this.countryList = this.configurationLoader.getConfiguration().countryList;
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => {
        this.currentUserSubject = currentUserSubject;
        this.dateAdapter.setLocale(this.currentUserSubject.languagecode);
        this.createForm();
      })
    );
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
      feedbackId: null,
      dateSentStart: null,
      dateSentEnd: null,
      dateSeenStart: null,
      dateSeenEnd: null,
      fromProfileId: null,
      fromName: null,
      adminProfileId: this.currentUserSubject.profileId,
      adminName: this.currentUserSubject.name,
      feedbackType: FeedbackType.NotChosen,
      message: null,
      open: 'notChosen',
      countrycode: null,
      languagecode: null
    });
  }

  onSubmit(): void {
    this.filter = this.prepareSearch();
    this.getFeedbacksByFilter.emit(this.filter);
  }

  reset(): void {
    this.createForm();
    this.searchResultFeedbacks = [];
  }

  private prepareSearch(): FeedbackFilter {
    const formModel = this.feedbackForm.value;

    const filterFeedback: FeedbackFilter = {

      feedbackId: formModel.feedbackId as string,
      dateSentStart: formModel.dateSentStart as Date,
      dateSentEnd: formModel.dateSentEnd as Date,
      dateSeenStart: formModel.dateSeenStart as Date,
      dateSeenEnd: formModel.dateSeenEnd as Date,
      fromProfileId: formModel.fromProfileId as string,
      fromName: formModel.fromName as string,
      adminProfileId: formModel.adminProfileId as string,
      adminName: formModel.adminName as string,
      feedbackType: null,
      message: formModel.message as string,
      open: null,
      countrycode: formModel.countrycode as string,
      languagecode: formModel.languagecode as string
    };

    if (formModel.feedbackType != 'NotChosen') {
      filterFeedback.feedbackType = formModel.feedbackType as FeedbackType;
    }

    if (formModel.open != 'notChosen') {
      filterFeedback.open = (formModel.open == "true");
    }

    return filterFeedback;
  }

  // Preserve original EnumMapping order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
}
