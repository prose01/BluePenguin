import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

import { ProfileService } from '../../services/profile.service';
import { CurrentUser } from '../../models/currentUser';
import { IImageModel } from '../../models/ImageModel';

@Component({
  selector: 'image-board',
  templateUrl: './image-board.component.html',
  styleUrls: ['./image-board.component.css']
})

export class ImageBoardComponent implements OnInit {
  isMatButtonToggled = true;
  matButtonToggleText: string = 'Upload new photo';

  currentUser: CurrentUser;

  images: any[] = [];
  imageModels: IImageModel[];

  constructor(public auth: AuthService, private profileService: ProfileService) { }


  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) { this.getCurrentUserProfile(); }
      });
    }
  }

  ngAfterContentInit(): void {
    setTimeout(() => { this.getCurrentUserImages(); }, 2000);  // Find på noget bedre end at vente 2 sek.
  }

  getCurrentUserProfile(): void {
    this.profileService.getCurrentUserProfile().subscribe(currentUser => { this.currentUser = currentUser; this.imageModels = currentUser.images });
  }

  getCurrentUserImages(): void {
    this.imageModels.forEach((element, i) => {
      setTimeout(() => {
        this.profileService.getImagesById(element.imageId).subscribe(images => this.images.push(images));
      }, i * 1000); // Find på noget bedre end at vente 1 sek.
    });

    //setTimeout(() => { console.log(this.images); }, 2000); // Find på noget bedre end at vente 2 sek.
  }

  toggleDisplay() {
    this.isMatButtonToggled = !this.isMatButtonToggled;
    this.matButtonToggleText = (this.isMatButtonToggled ? 'Upload new photo' : 'TileView');
  }
}
