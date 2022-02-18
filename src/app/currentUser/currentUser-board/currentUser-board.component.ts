import { Component, EventEmitter, Output } from '@angular/core';

import { AuthService } from './../../authorisation/auth/auth.service';
import { Profile } from '../../models/profile';

@Component({
  selector: 'currentUserBoard',
  templateUrl: './currentUser-board.component.html',
  styleUrls: ['./currentUser-board.component.scss']
})

export class CurrentUserBoardComponent {

  @Output("loadDetails") loadDetails: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService) { }

  loadProfileDetails(profile: Profile) {
    this.loadDetails.emit(profile);
  }
}
