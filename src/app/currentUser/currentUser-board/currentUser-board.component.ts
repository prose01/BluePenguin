import { Component, EventEmitter, Input, Output } from '@angular/core';

import { AuthService } from './../../authorisation/auth/auth.service';
import { Profile } from '../../models/profile';

@Component({
  selector: 'currentUserBoard',
  templateUrl: './currentUser-board.component.html'
})

export class CurrentUserBoardComponent {

  @Input() tabIndex: number = 0;

  @Output("loadDetails") loadDetails: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService) { }

  loadProfileDetails(profile: Profile): void {
    this.loadDetails.emit(profile);
  }
}
