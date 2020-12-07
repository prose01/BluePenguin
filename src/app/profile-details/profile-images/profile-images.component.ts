/*
 * @kolkov/ngx-gallery image gallery for Angular.
 * https://www.npmjs.com/package/@kolkov/ngx-gallery This is the version used here.
 * https://stackblitz.com/edit/kolkov-ngx-gallery Stackblitz example.
 *
 * This library is being fully rewritten for next Angular versions from original abandoned library written by Łukasz Gałka.
 * Kolkov maintain full compatibility with the original library at the api level. https://github.com/lukasz-galka/ngx-gallery
 *
 * Der skal findes en løsning på brugen af fontawesome.com i HTML-filen. Det holder simpelthen ikke!!!!
 * 
 */

import { Component, Input, OnInit } from '@angular/core';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from '@kolkov/ngx-gallery';

import { AuthService } from '../../authorisation/auth/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'profile-images',
  templateUrl: './profile-images.component.html'
})

export class ProfileImagesComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @Input() images: any[] = [];

  constructor(public auth: AuthService, private profileService: ProfileService) { }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {
          this.setGalleryOptions();
          this.setGalleryImages();
        }
      });
    }
  }

  //ngAfterContentInit(): void {
  //  setTimeout(() => { v }, 2000);  // Find på noget bedre end at vente 2 sek.
  //}

  setGalleryOptions(): void {
    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        arrowPrevIcon: 'fa fa-chevron-left',
        arrowNextIcon: 'fa fa-chevron-right',
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];
  }

  setGalleryImages(): void {
    const pics = [];
    this.images.forEach(element => pics.push(
      {
        small: 'data:image/png;base64,' + element,
        medium: 'data:image/png;base64,' + element,
        big: 'data:image/png;base64,' + element
      }
    ));

    this.galleryImages = pics;
  }
}
