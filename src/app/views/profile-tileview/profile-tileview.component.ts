import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { OrderByType } from '../../models/enums';


@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.scss']
})

@AutoUnsubscribe()
export class ProfileTileviewComponent implements OnChanges {

  selectedProfile: Profile;
  isMatButtonToggled = true;
  matButtonToggleIcon: string = 'expand_less';
  defaultImage = '../assets/default-person-icon.jpg';

  ///////

  //sum = 40;
  throttle = 1;
  scrollDistance = 2;
  scrollUpDistance = 3;
  //direction = '';

  ///////

  @Input() profiles: Profile[];
  @Input() showingBookmarkedProfilesList: boolean;
  @Input() orderBy: OrderByType;
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService) { }


  ngOnChanges(): void {
    // Remove empty profile from array.
    this.profiles = this.profiles?.filter(function (el) {
      return el != null;
    });
  }

  //////

  //addItems(startIndex, endIndex, _method) {
  //  //for (let i = 0; i < this.sum; ++i) {
  //  //  this.data[_method]([i, ' ', this.generateName()].join(''));
  //  console.log('method ' + _method);
  //  //}
  //}

  //appendItems(startIndex, endIndex) {
  //  this.addItems(startIndex, endIndex, 'push');
  //}

  //prependItems(startIndex, endIndex) {
  //  this.addItems(startIndex, endIndex, 'unshift');
  //}

  onScrollDown() {
    console.log('scrolled down!!');
    this.profiles = this.profiles.concat(this.profiles);
    console.log('length' + this.profiles.length);
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

  //////

  toggleDisplayOrder() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'expand_less' : 'expand_more');
    
    switch (this.orderBy) {
      case OrderByType.UpdatedOn: {
        if (new Date(this.profiles[0].updatedOn) < new Date(this.profiles[this.profiles.length - 1].updatedOn)) {
          this.profiles.sort((a, b) => (new Date(a.updatedOn) < new Date(b.updatedOn)) ? 1 : -1);
        }
        else {
          this.profiles.sort((a, b) => (new Date(a.updatedOn) > new Date(b.updatedOn)) ? 1 : -1);
        }
        break;
      }
      case OrderByType.LastActive: {
        if (new Date(this.profiles[0].lastActive) < new Date(this.profiles[this.profiles.length - 1].lastActive)) {
          this.profiles.sort((a, b) => (new Date(a.lastActive) < new Date(b.lastActive)) ? 1 : -1);
        }
        else {
          this.profiles.sort((a, b) => (new Date(a.lastActive) > new Date(b.lastActive)) ? 1 : -1);
        }
        break;
      }
      default: {
        if (new Date(this.profiles[0].createdOn) < new Date(this.profiles[this.profiles.length - 1].createdOn)) {
          this.profiles.sort((a, b) => (new Date(a.createdOn) < new Date(b.createdOn)) ? 1 : -1);
        }
        else {
          this.profiles.sort((a, b) => (new Date(a.createdOn) > new Date(b.createdOn)) ? 1 : -1);
        }
        break;
      }
    }
  }

  // Get Bookmarked Profiles.
  triggerBookmarkedProfiles() {
    this.getBookmarkedProfiles.emit();
  }


  /** Add or remove bookmarks */
  removeFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { }, () => { }, () => { this.getBookmarkedProfiles.emit(); });
  }

  addFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles)
      .pipe(takeWhileAlive(this))
      .subscribe(() => { });
  }
}
