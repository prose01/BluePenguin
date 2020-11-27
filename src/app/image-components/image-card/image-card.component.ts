import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';

import { Profile } from '../../models/profile';
import { ProfileService } from '../../services/profile.service';
import { DeleteImageDialog } from '../delete-image/delete-image-dialog.component';

@Component({
  selector: 'image-card',
  templateUrl: 'image-card.component.html',
  styleUrls: ['image-card.component.css'],
})

export class ImageCardComponent {

  @Input() profile: Profile;
  @Input() showingBookmarkedProfilesList: boolean;
  @Output("triggerBookmarkedProfiles") triggerBookmarkedProfiles: EventEmitter<any> = new EventEmitter();

  constructor(public auth: AuthService, private profileService: ProfileService, private dialog: MatDialog) { }

  /** Add or remove bookmarks */
  removeFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.removeProfilesFromBookmarks(selcetedProfiles).subscribe(() => { }, () => { }, () => { this.triggerBookmarkedProfiles.emit(); });
  }

  addFavoritProfiles(profileId: string) {
    let selcetedProfiles = new Array;
    selcetedProfiles.push(profileId);

    this.profileService.addProfilesToBookmarks(selcetedProfiles).subscribe(() => { });
  }

  //openDeleteImageDialog(imageId): void {
  //  const dialogRef = this.dialog.open(DeleteImageDialog, {
  //    height: '300px',
  //    width: '300px',
  //    data: { imageId }
  //  });

  //  dialogRef.afterClosed().subscribe(result => {
  //    //this.refreshCurrentUserImages.emit();
  //  });
  //}
}
