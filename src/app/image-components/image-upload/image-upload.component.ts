/*
 * Image cropper for Angular.
 * https://github.com/Mawi137/ngx-image-cropper
 * https://stackblitz.com/edit/image-cropper example code used in this app.
 */


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Dimensions, ImageCroppedEvent, ImageTransform } from '../image-cropper/interfaces/index';
import { base64ToFile } from '../image-cropper/utils/blob.utils';
import { HttpEventType } from '@angular/common/http';

import { AuthService } from '../../authorisation/auth/auth.service';

import { ProfileService } from '../../services/profile.service';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.css']
})

export class ImageUploadComponent {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  fileUploadProgress: string = null;
  title: string = null;

  constructor(public auth: AuthService, private profileService: ProfileService, private router: Router) { }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    //console.log(event, base64ToFile(event.base64));
  }

  imageLoaded() {
    this.showCropper = true;
    //console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    //console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    //console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  zoomIn() {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('image', base64ToFile(this.croppedImage));
    formData.append('title', this.title);

    this.fileUploadProgress = '0%';

    this.profileService.uploadImage(formData)
      .subscribe(events => {
        if (events.type === HttpEventType.UploadProgress) {
          this.fileUploadProgress = Math.round(events.loaded / events.total * 100) + '%';
          //console.log(this.fileUploadProgress);
          alert('Your photo has been uploaded');
          this.router.navigate(['/imagesboard']);
        } else if (events.type === HttpEventType.Response) {
          this.fileUploadProgress = '';
        }
      })
  }
}
