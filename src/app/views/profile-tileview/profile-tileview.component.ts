import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';

import { AuthService } from '../../authorisation/auth/auth.service';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { OrderByType } from '../../models/enums';
import { ViewFilterTypeEnum } from '../../models/viewFilterTypeEnum';


@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.scss']
})

@AutoUnsubscribe()
export class ProfileTileviewComponent implements OnChanges {

  selectedProfile: Profile;
  pageIndex: number;
  pageSize: number = 20;
  loading: boolean = true;
  throttle = 1;
  scrollDistance = 2;
  scrollUpDistance = 3;
  defaultImage = '../assets/default-person-icon.jpg';
  noProfiles: boolean = false;

  @Input() profiles: Profile[];
  @Input() viewFilterType: ViewFilterTypeEnum;
  @Input() orderBy: OrderByType;
  @Output("getNextTileData") getNextTileData: EventEmitter<any> = new EventEmitter();
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();
  @Output("loadProfileDetails") loadProfileDetails: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService) { }


  ngOnChanges(): void {
    // Remove empty profile from array.
    this.profiles = this.profiles?.filter(function (el) {
      return el != null;
    });

    this.profiles?.length <= 0 ? this.noProfiles = true : this.noProfiles = false;
  }

  onScrollDown() {
    console.log('scrolled down!!');

    let pageIndex = 2; // TODO: auto count up ++
    let currentSize = this.pageSize * pageIndex;

    this.getNextTileData.emit({ viewFilterType: this.viewFilterType, currentSize: currentSize, pageIndex: pageIndex.toString(), pageSize: this.pageSize.toString() });
  }

  onScrollUp() {
    console.log('scrolled up!!');

    //this.getPreviousData.emit({ viewFilterType: this.viewFilterType, currentSize: currentSize, pageIndex: pageIndex.toString(), pageSize: this.pageSize.toString() });
  }

  //toggleDisplayOrder() {
  //  this.isMatButtonToggled = !this.isMatButtonToggled;
  //  this.matButtonToggleIcon = (this.isMatButtonToggled ? 'expand_less' : 'expand_more');
    
  //  switch (this.orderBy) {
  //    case OrderByType.UpdatedOn: {
  //      if (new Date(this.profiles[0].updatedOn) < new Date(this.profiles[this.profiles.length - 1].updatedOn)) {
  //        this.profiles.sort((a, b) => (new Date(a.updatedOn) < new Date(b.updatedOn)) ? 1 : -1);
  //      }
  //      else {
  //        this.profiles.sort((a, b) => (new Date(a.updatedOn) > new Date(b.updatedOn)) ? 1 : -1);
  //      }
  //      break;
  //    }
  //    case OrderByType.LastActive: {
  //      if (new Date(this.profiles[0].lastActive) < new Date(this.profiles[this.profiles.length - 1].lastActive)) {
  //        this.profiles.sort((a, b) => (new Date(a.lastActive) < new Date(b.lastActive)) ? 1 : -1);
  //      }
  //      else {
  //        this.profiles.sort((a, b) => (new Date(a.lastActive) > new Date(b.lastActive)) ? 1 : -1);
  //      }
  //      break;
  //    }
  //    default: {
  //      if (new Date(this.profiles[0].createdOn) < new Date(this.profiles[this.profiles.length - 1].createdOn)) {
  //        this.profiles.sort((a, b) => (new Date(a.createdOn) < new Date(b.createdOn)) ? 1 : -1);
  //      }
  //      else {
  //        this.profiles.sort((a, b) => (new Date(a.createdOn) > new Date(b.createdOn)) ? 1 : -1);
  //      }
  //      break;
  //    }
  //  }
  //}

  // Load Detalails page  // TODO: Tile and list view need to call this.
  loadDetails(profileId: string) {
    this.loadProfileDetails.emit(profileId);
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
