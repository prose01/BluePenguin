import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { Subscription } from 'rxjs';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { ProfileChatListviewComponent } from '../profile-chats/profile-chat-listview.component';

@Component({
  selector: 'profileDetailsBoard',
  templateUrl: './profile-details-board.component.html'
})

export class ProfileDetailsBoardComponent implements OnInit, OnDestroy {
  private pinacothecaUrl: string;

  private subs: Subscription[] = [];

  public loading: boolean = false;
  public isChatSearch: boolean = false;

  public tabIndex = 0;

  public currentUserSubject: CurrentUser;
  private _profile: Profile;

  @Input() set profile(values: Profile) {
    this._profile = values;
    this.updateProfile();
  }
  get profile(): Profile {
    return this._profile;
  }

  @Output("loadDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  @ViewChild(ProfileChatListviewComponent) profileChatListviewComponent: ProfileChatListviewComponent;

  constructor(private profileService: ProfileService, private configurationLoader: ConfigurationLoader) {
    this.pinacothecaUrl = this.configurationLoader.getConfiguration().pinacothecaUrl;
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; })
    );

    this.getProfileImages();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  updateProfile(): void {
    this.getProfileImages();
    this.tabIndex = 0;
  }

  private getProfileImages(): void {

    if (this.profile.images != null && this.profile.images.length > 0) {

      this.profile.images.forEach((element) => {

        if (typeof element.fileName !== 'undefined') {
          element.image = this.pinacothecaUrl + this.profile.profileId + '/' + element.fileName
        }

      });
    }
  }

  // Load Detalails page
  private loadDetails(profile: Profile): void {
    this.loadProfileDetails.emit(profile);
  }

  private chatSearch(searching: boolean): void {
    this.isChatSearch = searching;
  }

  // Calls to ProfileChatSearchComponent
  private onSubmit(): void {
    this.profileChatListviewComponent.onSubmit();
    this.isChatSearch = false;
  }

  private reset(): void {
    this.profileChatListviewComponent.reset();
  }
}
