import { Component, Input, EventEmitter, Output } from '@angular/core';

import { AuthService } from '../../authorisation/auth/auth.service';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { OrderByType } from '../../models/enums';


@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.css']
})

export class ProfileTileviewComponent {

  selectedProfile: Profile;
  isMatButtonToggled = true;
  matButtonToggleIcon: string = 'expand_less';

  //imageSizes: string[] = ['width:25%', 'width:75%', 'width:50%', 'width:100%', 'width:50%', 'width:25%', 'width:75%'];

  @Input() profiles: Profile[];
  @Input() showingBookmarkedProfilesList: boolean;
  @Input() orderBy: OrderByType;
  @Output("getBookmarkedProfiles") getBookmarkedProfiles: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService) { }


  toggleDisplayOrder() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'expand_less' : 'expand_more');
    
    switch (this.orderBy) {
      case OrderByType.UpdatedOn: {
        this.profiles.sort((a, b) => (a.updatedOn > b.updatedOn) ? 1 : -1);
        break;
      }
      case OrderByType.LastActive: {
        this.profiles.sort((a, b) => (a.lastActive > b.lastActive) ? 1 : -1);
        break;
      }
      default: {
        this.profiles.sort((a, b) => (a.createdOn > b.createdOn) ? 1 : -1);
        break;
      }
    } 
    //this.profiles = (this.isMatButtonToggled ? this.profiles.sort((a, b) => (a.createdOn > b.createdOn) ? 1 : -1) : this.profiles.sort((a, b) => (a.updatedOn > b.updatedOn) ? 1 : -1));
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
