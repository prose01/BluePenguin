import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { ChatFilter } from '../../models/chatFilter';
import { DateAdapter } from '@angular/material/core';

@Component({
  selector: 'profile-chat-search',
  templateUrl: './profile-chat-search.component.html'
})

export class ProfileChatSearchComponent {

  loading: boolean = false;

  filter: ChatFilter = new ChatFilter();
  searchResultFeedbacks: ChatFilter[];
  chatFilterForm: FormGroup;
  dateSentStart: Date;
  dateSentEnd: Date;
  dateSeenStart: Date;
  dateSeenEnd: Date;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  message: string;
  doNotDelete: boolean;

  @Output('getChatsByFilter') getChatsByFilter = new EventEmitter<ChatFilter>();

  constructor(private formBuilder: FormBuilder, private dateAdapter: DateAdapter<Date>, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.createForm();
  }

  createForm() {
    this.chatFilterForm = this.formBuilder.group({
      dateSentStart: null,
      dateSentEnd: null,
      dateSeenStart: null,
      dateSeenEnd: null,
      fromId: null,
      fromName: null,
      toId: null,
      toName: null,
      message: null,
      doNotDelete: 'notChosen'
    });
  }

  onSubmit() {
    this.filter = this.prepareSearch();

    // Just return if no search input.
    if (this.filter.dateSeenEnd == null &&
      this.filter.dateSeenStart == null &&
      this.filter.dateSentEnd == null &&
      this.filter.dateSentStart == null &&
      this.filter.doNotDelete == null &&
      this.filter.fromId == null &&
      this.filter.fromName == null &&
      this.filter.toId == null &&
      this.filter.toName == null) {
      return;
    }

    this.getChatsByFilter.emit(this.filter);
  }

  reset() {
    this.createForm();
    this.searchResultFeedbacks = [];
  }

  prepareSearch(): ChatFilter {
    const formModel = this.chatFilterForm.value;

    const filterChat: ChatFilter = {

      dateSentStart: formModel.dateSentStart as Date,
      dateSentEnd: formModel.dateSentEnd as Date,
      dateSeenStart: formModel.dateSeenStart as Date,
      dateSeenEnd: formModel.dateSeenEnd as Date,
      fromId: formModel.fromId as string,
      fromName: formModel.fromName as string,
      toId: formModel.toId as string,
      toName: formModel.toName as string,
      message: null,
      doNotDelete: null
    };

    if (formModel.doNotDelete != 'notChosen') {
      filterChat.doNotDelete = formModel.doNotDelete as boolean;
    }

    return filterChat;
  }
}
