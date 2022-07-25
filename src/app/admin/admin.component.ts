import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { CurrentUser } from '../models/currentUser';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})

export class AdminComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  // TODO: Should be private
  deleteOldProfiles(): void {
    if (this.currentUserSubject.admin) {
      this.subs.push(
        this.profileService.deleteOldProfiles()
          .subscribe({
            next: () => { },
            complete: () => { },
            error: () => { }
          })
      );
    }
  }

  // TODO: Should be private
  cleanCurrentUser(): void {
    if (this.currentUserSubject.admin) {
      this.subs.push(
        //this.profileService.cleanAdmin()
        //  .subscribe({
        //    next: () => { },
        //    complete: () => { },
        //    error: () => { }
        //  })
      );
    }
  }
}


