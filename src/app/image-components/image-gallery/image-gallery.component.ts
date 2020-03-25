/*
 * ngx-image-gallery image gallery for Angular.
 * https://www.npmjs.com/package/ngx-image-gallery/v/2.0.1 This is the version used here.
 * https://www.npmjs.com/package/ngx-image-gallery/v/2.0.3 This is the lastest version used.
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxImageGalleryComponent} from "ngx-image-gallery";
import { GALLERY_IMAGE } from "./IGALLERY_IMAGE";
import { GALLERY_CONF } from "./IGALLERY_CONF";

@Component({
  selector: 'app-imageGallery.',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.css'],
})

export class ImageGalleryComponent implements OnInit {
  // get reference to gallery component
  @ViewChild(NgxImageGalleryComponent) ngxImageGallery: NgxImageGalleryComponent;

  // gallery configuration
  conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
  };

  // gallery images
  images: GALLERY_IMAGE[] = [
    {
      url: 'C:/Peter Rose - Private/Photos/123/urxksocb.jpg',
      altText: 'woman-in-black-blazer-holding-blue-cup',
      title: 'woman-in-black-blazer-holding-blue-cup',
      thumbnailUrl: 'C:/Peter Rose - Private/Photos/123/urxksocb.jpg'
    },
    //{
    //  url: 'C:/Peter Rose - Private/Photos/123/urxksocb.jpg',
    //  altText: 'two-woman-standing-on-the-ground-and-staring-at-the-mountain',
    //  extUrl: 'C:/Peter Rose - Private/Photos/123/urxksocb.jpg',
    //  thumbnailUrl: 'C:/Peter Rose - Private/Photos/123/urxksocb.jpg'
    //},
  ];

  constructor() { }

  ngOnInit() { }

  // METHODS
  // open gallery
  openGallery(index: number = 0) {
    this.ngxImageGallery.open(index);
  }

  // close gallery
  closeGallery() {
    this.ngxImageGallery.close();
  }

  // set new active(visible) image in gallery
  newImage(index: number = 0) {
    this.ngxImageGallery.setActiveImage(index);
  }

  // next image in gallery
  nextImage(index: number = 0) {
    this.ngxImageGallery.next();
  }

  // prev image in gallery
  prevImage(index: number = 0) {
    this.ngxImageGallery.prev();
  }

  /**************************************************/

  // EVENTS
  // callback on gallery opened
  galleryOpened(index) {
    console.info('Gallery opened at index ', index);
  }

  // callback on gallery closed
  galleryClosed() {
    console.info('Gallery closed.');
  }

  // callback on gallery image clicked
  galleryImageClicked(index) {
    console.info('Gallery image clicked with index ', index);
  }

  // callback on gallery image changed
  galleryImageChanged(index) {
    console.info('Gallery image changed to index ', index);
  }

  // callback on user clicked delete button
  deleteImage(index) {
    console.info('Delete image at index ', index);
  }
}
