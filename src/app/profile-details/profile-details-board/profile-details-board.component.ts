import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { ImageService } from '../../services/image.service';
import { Profile } from '../../models/profile';
import { ImageSizeEnum } from '../../models/imageSizeEnum';
import { ImageModel } from '../../models/imageModel';
import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { ProfileChatListviewComponent } from '../profile-chats/profile-chat-listview.component';

@Component({
  selector: 'profileDetailsBoard',
  templateUrl: './profile-details-board.component.html'
})

export class ProfileDetailsBoardComponent implements OnInit, OnChanges, OnDestroy {
  loading: boolean = false;
  isChatSearch: boolean = false;

  tabIndex = 0;

  private subs: Subscription[] = [];
  currentUserSubject: CurrentUser;

  @Input() profile: Profile;
  @Output("loadDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  @ViewChild(ProfileChatListviewComponent) profileChatListviewComponent: ProfileChatListviewComponent;

  constructor(private imageService: ImageService, private profileService: ProfileService) { }

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

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.profile.firstChange) {
      if (changes.profile.currentValue != changes.profile.previousValue) {
        this.getProfileImages();
        this.tabIndex = 0;
      }
    }
  }

  private getProfileImages(): void {
    let defaultImageModel: ImageModel = new ImageModel();

    if (this.profile.images != null && this.profile.images.length > 0) {

      this.profile.images.forEach((element, i) => {

        if (typeof element.fileName !== 'undefined') {

          this.loading = true;

          this.subs.push(
            this.imageService.getProfileImageByFileName(this.profile.profileId, element.fileName, ImageSizeEnum.small)
              .subscribe(
                images => { element.smallimage = 'data:image/jpeg;base64,' + images.toString() },
                () => { this.loading = false; element.image = defaultImageModel.image },
                () => { this.loading = false; }
              )
          );

          this.subs.push(
            this.imageService.getProfileImageByFileName(this.profile.profileId, element.fileName, ImageSizeEnum.large)
              .subscribe(
                images => { element.image = 'data:image/jpeg;base64,' + images.toString() },
                () => { this.loading = false; element.smallimage = defaultImageModel.smallimage },
                () => { this.loading = false; }
              )
          );
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
