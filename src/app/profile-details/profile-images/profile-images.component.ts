import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../authorisation/auth/auth.service';
import { ImageDialog } from '../../image-components/image-dialog/image-dialog.component';
import { Profile } from '../../models/profile';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'profile-images',
  templateUrl: './profile-images.component.html',
  styleUrls: ['./profile-images.component.scss']
})

export class ProfileImagesComponent implements OnInit {

  private _smallImages = new BehaviorSubject<any[]>([]);
  private _images = new BehaviorSubject<any[]>([]);

  @Input() profile: Profile;
  @Input() set smallImages(value: any[]) {
    this._smallImages.next(value);
  }
  @Input() set images(value: any[]) {
    this._images.next(value);
  }

  imagesTitles: string[] = [];
  galleryImages: any[] = [];
  defaultImage: any[] = [];
  loading: boolean = true;


  constructor(public auth: AuthService, private dialog: MatDialog) { }

  //get smallImages() {
  //  return this._smallImages.getValue();
  //}

  //get images() {
  //  return this._images.getValue();
  //}


  ngOnInit() {
    if (this.auth.isAuthenticated()) {

      this.setImageTitles(this.profile);

      this._smallImages.subscribe(x => {
        this.setSmallGalleryImages(x);
      });

      this._images.subscribe(x => {
        this.setGalleryImages(x);
      });
    }
  }

  setSmallGalleryImages(smallImages: any[]): void {
    const pics = [];
    smallImages.forEach(element => pics.push(
      'data:image/jpg;base64,' + element
    ));

    this.defaultImage = pics;
  }

  setGalleryImages(images: any[]): void {
    const pics = [];
    images.forEach(element => pics.push(
        'data:image/jpg;base64,' + element
    ));
    this.galleryImages = pics;
  }

  setImageTitles(profile: Profile): void {
    const imageTitles = [];
    profile.images.forEach(element => imageTitles.push(
      element.title
    ));

    this.imagesTitles = imageTitles;
  }

  openImageDialog(indexOfelement: any): void {
    const dialogRef = this.dialog.open(ImageDialog, {
      //height: '80%',
      //width: '80%',
      data: {
        index: indexOfelement,
        images: this.galleryImages, // TODO: use defaultImage first, then galleryImage
        titles: this.imagesTitles
      }
    });
  }
}
