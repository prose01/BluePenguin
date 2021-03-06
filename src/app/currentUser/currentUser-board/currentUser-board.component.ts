import { Component } from '@angular/core';

import { AuthService } from './../../authorisation/auth/auth.service';

@Component({
  selector: 'currentUserBoard',
  templateUrl: './currentUser-board.component.html',
  styleUrls: ['./currentUser-board.component.css']
})
export class CurrentUserBoardComponent {
  constructor(public auth: AuthService) { }
}
