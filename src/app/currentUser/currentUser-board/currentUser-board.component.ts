import { Component, Input } from '@angular/core';

import { AuthService } from './../../authorisation/auth/auth.service';

@Component({
  selector: 'currentUserBoard',
  templateUrl: './currentUser-board.component.html'
})

export class CurrentUserBoardComponent {

  @Input() tabIndex: number = 0;
  
  constructor(public auth: AuthService) { }
}
