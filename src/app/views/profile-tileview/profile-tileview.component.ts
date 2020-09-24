import { Component, Input, EventEmitter, Output } from '@angular/core';

import { AuthService } from '../../authorisation/auth/auth.service';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';


@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.css']
})

export class ProfileTileviewComponent {

  selectedProfile: Profile;
  isMatButtonToggled = true;
  matButtonToggleText: string = 'Lastest Created';

  @Input() profiles: Profile[];
  @Input() showingBookmarkedProfilesList: boolean;
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService) { }


  toggleDisplayOrder() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'Lastest Created' : 'Lastest Updated');
    this.profiles = (this.isMatButtonToggled ? this.profiles.sort((a, b) => (a.createdOn > b.createdOn) ? 1 : -1) : this.profiles.sort((a, b) => (a.updatedOn > b.updatedOn) ? 1 : -1));
  }


  /** Add or remove bookmarks */
  removeFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles).subscribe(() => { }, () => { }, () => { this.getBookmarkedProfiles.emit(); });
  }

  addFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles).subscribe(() => { });
  }
}
