import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl} from '@angular/forms';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { TranslocoService } from '@ngneat/transloco';

import { EnumMappingService } from '../../services/enumMapping.service';
import { ProfileService } from '../../services/profile.service';
import { BehaviorSubjectService } from '../../services/behaviorSubjec.service';
import { CurrentUser } from '../../models/currentUser';
import { ViewFilterTypeEnum } from '../../models/viewFilterTypeEnum';
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

@AutoUnsubscribe()
export class FeedbackSearchComponent implements OnInit {

  loading: boolean = false;

  filter: FeedbackFilter = new FeedbackFilter();
  searchResultFeedbacks: Feedback[];
  viewFilterType: ViewFilterTypeEnum = ViewFilterTypeEnum.FilterProfiles;
  feedbackForm: FormGroup;
  feedbackId: string;
  dateSentStart: Date;
  dateSentEnd: Date;
  dateSeenStart: Date;
  dateSeenEnd: Date;
  fromProfileId: string;
  fromName: string;
  adminProfileId: string;
  adminName: string;
  feedbackTypes: ReadonlyMap<string, string>;
  message: string;
  open: string;
  countrycode: string;
  languagecode: string;

  currentUserSubject: CurrentUser;

  languageList: string[] = [];
  countryList: string[] = [];

  @Output() getFeedbacksByFilter = new EventEmitter<FeedbackFilter>();

  constructor(private enumMappings: EnumMappingService, private profileService: ProfileService, private behaviorSubjectService: BehaviorSubjectService, private formBuilder: FormBuilder, private dateAdapter: DateAdapter<Date>, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {

    this.languageList = this.configurationLoader.getConfiguration().languageList;
    this.countryList = this.configurationLoader.getConfiguration().countryList;
  }

  createForm() {
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
      feedbackType: FeedbackType.Comment,
      message: null,
      open: 'notChosen',
      countrycode: null,
      languagecode: null
    });
  }

  ngOnInit() {
    this.profileService.currentUserSubject.subscribe(currentUserSubject => {
      this.currentUserSubject = currentUserSubject;
      this.dateAdapter.setLocale(this.currentUserSubject.languagecode);
      this.createForm();
    });
    this.enumMappings.feedbackTypeSubject.subscribe(value => this.feedbackTypes = value);
    this.enumMappings.updateFeedbackTypeSubject();
  }

  onSubmit() {
    this.filter = this.prepareSearch();
    this.getFeedbacksByFilter.emit(this.filter);
  }

  reset() {
    this.createForm();
    this.searchResultFeedbacks = [];
  }

  prepareSearch(): FeedbackFilter {
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
      feedbackType: formModel.feedbackType as FeedbackType,
      message: formModel.message as string,
      open: null,
      countrycode: formModel.countrycode as string,
      languagecode: formModel.languagecode as string
    };

    if (formModel.open != 'notChosen' && formModel.open != null) {
      filterFeedback.open = formModel.open as string;
    }
    
    return filterFeedback;
  }


  // Preserve original EnumMapping order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
}
