import { Component, Input } from '@angular/core';

import { AuthService } from '../../authorisation/auth/auth.service';

import { Profile } from '../../models/profile';

@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.css']
})

export class ProfileTileviewComponent {

  selectedProfile: Profile;
  isMatButtonToggled = true;
  matButtonToggleText: string = 'Lastest Created';

  @Input() profiles: Profile[]; // Brug RxJS BehaviorSubject !!!!! Således at add-remove bookmarks opdateret auto.

  constructor(public auth: AuthService) { }


  toggleDisplayOrder() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'Lastest Created' : 'Lastest Updated');
    this.profiles = (this.isMatButtonToggled ? this.profiles.sort((a, b) => (a.createdOn > b.createdOn) ? 1 : -1) : this.profiles.sort((a, b) => (a.updatedOn > b.updatedOn) ? 1 : -1));
  }
}
