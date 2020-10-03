import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { ImageService } from '../../services/image.service';
import { CurrentUser } from '../../models/currentUser';
import { ImageModel } from '../../models/ImageModel';

@Component({
  selector: 'image-board',
  templateUrl: './image-board.component.html',
  styleUrls: ['./image-board.component.css']
})

export class ImageBoardComponent implements OnInit {
  isMatButtonToggled = true;
  matButtonToggleIcon: string = 'cloud_upload';
  matButtonToggleText: string = 'Upload new photo';

  currentUserSubject: CurrentUser;
  imageModels: ImageModel[];

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService) { }


  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; this.imageModels = currentUserSubject.images});
        }
      });
    }
  }

  ngAfterContentInit(): void {
    setTimeout(() => { this.getCurrentUserImages(); }, 2000);  // Find på noget bedre end at vente 2 sek.
  }

  getCurrentUserImages(): void {
    if (this.imageModels != null) {
      if (this.imageModels.length > 0) {
        this.imageModels.forEach((element, i) => {
          setTimeout(() => {
            this.imageService.getImageByFileName(element.fileName).subscribe(images => element.image = 'data:image/png;base64,' + images.toString());
          }, i * 1000); // Find på noget bedre end at vente 1 sek.
        });
      }
    }
    //setTimeout(() => { console.log(this.imageModels); }, 2000); // Find på noget bedre end at vente 2 sek.
  }

  toggleDisplay() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'Upload new photo' : 'TileView');
    this.matButtonToggleIcon = (this.isMatButtonToggled ? 'cloud_upload' : 'collections');
  }
}
