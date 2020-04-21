import { Component, Input } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

import { Profile } from '../../models/profile';

@Component({
  selector: 'app-profile-tileview',
  templateUrl: './profile-tileview.component.html',
  styleUrls: ['./profile-tileview.component.css']
})

export class ProfileTileviewComponent {

  selectedProfile: Profile;

  @Input() profiles: Profile[]; // Brug RxJS BehaviorSubject !!!!! Således at add-remove bookmarks opdateret auto.

  constructor(public auth: AuthService) { }
}
