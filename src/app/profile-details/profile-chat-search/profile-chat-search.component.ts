import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslocoService } from '@ngneat/transloco';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { ChatFilter } from '../../models/chatFilter';
import { DateAdapter } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { EnumMappingService } from '../../services/enumMapping.service';
import { MessageType } from '../../models/messageType';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'profile-chat-search',
  templateUrl: './profile-chat-search.component.html'
})

export class ProfileChatSearchComponent implements OnInit {

  public loading: boolean = false;

  private subs: Subscription[] = [];

  private filter: ChatFilter = new ChatFilter();
  private searchResultFeedbacks: ChatFilter[];
  public chatFilterForm: FormGroup;
  private dateSentStart: Date;
  private dateSentEnd: Date;
  private dateSeenStart: Date;
  private dateSeenEnd: Date;
  public messageTypes: ReadonlyMap<string, string>;
  private fromId: string;
  private fromName: string;
  private toId: string;
  private toName: string;
  private message: string;
  public doNotDelete: boolean;

  @Output('getChatsByFilter') getChatsByFilter = new EventEmitter<ChatFilter>();

  constructor(private enumMappings: EnumMappingService, private formBuilder: FormBuilder, private dateAdapter: DateAdapter<Date>, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.subs.push(
      this.enumMappings.messageTypesSubject.subscribe(value => this.messageTypes = value)
    );
    this.enumMappings.updateMessageTypeSubject();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private createForm(): void {
    this.chatFilterForm = this.formBuilder.group({
      dateSentStart: null,
      dateSentEnd: null,
      dateSeenStart: null,
      dateSeenEnd: null,
      messageType: MessageType.NotChosen,
      fromId: null,
      fromName: null,
      toId: null,
      toName: null,
      message: null,
      doNotDelete: 'notChosen'
    });
  }

  onSubmit(): void {
    this.filter = this.prepareSearch();

    // Just return if no search input.
    if (this.filter.dateSeenEnd == null &&
      this.filter.dateSeenStart == null &&
      this.filter.dateSentEnd == null &&
      this.filter.dateSentStart == null &&
      this.filter.doNotDelete == null &&
      this.filter.messageType == null &&
      this.filter.fromId == null &&
      this.filter.fromName == null &&
      this.filter.toId == null &&
      this.filter.toName == null) {
      return;
    }

    this.getChatsByFilter.emit(this.filter);
  }

  reset(): void {
    this.createForm();
    this.searchResultFeedbacks = [];
  }

  private prepareSearch(): ChatFilter {
    const formModel = this.chatFilterForm.value;

    const filterChat: ChatFilter = {

      dateSentStart: formModel.dateSentStart as Date,
      dateSentEnd: formModel.dateSentEnd as Date,
      dateSeenStart: formModel.dateSeenStart as Date,
      dateSeenEnd: formModel.dateSeenEnd as Date,
      messageType: null,
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

    if (formModel.messageType != MessageType.NotChosen) {
      filterChat.messageType = formModel.messageType as MessageType;
    }

    return filterChat;
  }

  // Preserve original EnumMapping order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }
}
