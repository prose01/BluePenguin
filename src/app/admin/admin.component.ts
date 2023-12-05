import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

import { ErrorDialog } from '../error-dialog/error-dialog.component';
import { CurrentUser } from '../models/currentUser';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html'
})

export class AdminComponent implements OnInit, OnDestroy {

  private subs: Subscription[] = [];
  public deleteProfilesForm: FormGroup;
  private currentUserSubject: CurrentUser;
  public loading: boolean = false;

  constructor(private profileService: ProfileService, private formBuilder: FormBuilder, private dialog: MatDialog, private readonly translocoService: TranslocoService) {
    //this.createForm();
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => this.currentUserSubject = currentUserSubject)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }
  
}


