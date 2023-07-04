/*
 * Image cropper for Angular.
 * https://github.com/Mawi137/ngx-image-cropper
 * https://stackblitz.com/edit/image-cropper example code used in this app.
 */


import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfigurationLoader } from '../../configuration/configuration-loader.service';
import { TranslocoService } from '@ngneat/transloco';

import { Dimensions, ImageCroppedEvent, ImageTransform } from '../image-cropper/interfaces/index';
import { DomSanitizer } from '@angular/platform-browser';
//import { base64ToFile } from '../image-cropper/utils/blob.utils';
import { Subscription } from 'rxjs';

import { ImageService } from '../../services/image.service';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html'
})

export class ImageUploadComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  public uploadImageForm: FormGroup;
  public imageChangedEvent: any = '';
  private croppedImage: any = null;
  public canvasRotation = 0;
  private rotation = 0;
  public translateH: number = 0;
  public translateV: number = 0;
  private scale = 1;
  public showCropper = false;
  public containWithinAspectRatio = false;
  public transform: ImageTransform = {
    translateUnit: 'px'
  };
  public loading: boolean = false;
  public allowMoveImage: boolean = false;
  public hidden: boolean = false;

  private titlePlaceholder: string;
  public uploadingPhoto: boolean = false;
  private fileSizeLimit: number;
  private imageTitleMaxLength: number;
  public imageMaxWidth: number;
  public imageMaxHeight: number;


  @Output("toggleDisplay") toggleDisplay: EventEmitter<any> = new EventEmitter();

  constructor(private sanitizer: DomSanitizer, private imageService: ImageService, private formBuilder: FormBuilder, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
    this.fileSizeLimit = this.configurationLoader.getConfiguration().fileSizeLimit;
    this.imageTitleMaxLength = this.configurationLoader.getConfiguration().imageTitleMaxLength;
    this.imageMaxWidth = this.configurationLoader.getConfiguration().imageMaxWidth;
    this.imageMaxHeight = this.configurationLoader.getConfiguration().imageMaxHeight;
    this.createForm();
  }

  ngOnInit(): void {
    this.subs.push(
      this.translocoService.selectTranslate('ImageUploadComponent.TitlePlaceholder').subscribe(value => this.titlePlaceholder = value)
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private createForm(): void {
    this.uploadImageForm = this.formBuilder.group({
      file: null,
      title: [null, [Validators.maxLength(this.imageTitleMaxLength)]]
    });
  }

  onChange(): void {
    if (this.uploadImageForm.invalid) {
      this.uploadImageForm.setErrors({ ...this.uploadImageForm.errors, 'uploadImageForm': true });

      if (this.uploadImageForm.controls.title.errors.maxlength) {
        this.subs.push(
          this.translocoService.selectTranslate('ImageUploadComponent.TitlePlaceholderError', { imageTitleMaxLength : this.imageTitleMaxLength }).subscribe(value => this.titlePlaceholder = value)
        );
      }
    }
  }

  fileChangeEvent(event: any): void {
    if (event.target.files[0] != null) {
      let sizeInBytes: number = event.target.files[0].size;
      
      if (sizeInBytes <= this.fileSizeLimit) {
        this.imageChangedEvent = event;
      }
      else {
        var limitMB = (this.fileSizeLimit / 1000000);
        this.openErrorDialog(this.translocoService.translate("CouldNotUploadImage"), this.translocoService.translate("ImageUploadComponent.ImageSizeLimit", { limitMB: Math.floor(limitMB) }));
      }
    }
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.blob;
  }

  imageLoaded(): void {
    this.showCropper = true;
  }

  loadImageFailed(): void {
    //console.log('Load failed');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
    this.loading = false;
  }

  private rotateLeft(): void {
    this.loading = true;
    setTimeout(() => { // Use timeout because rotating image is a heavy operation and will block the ui thread
      this.canvasRotation--;
      this.flipAfterRotate();
    });
  }

  private rotateRight(): void {
    this.loading = true;
    setTimeout(() => {
      this.canvasRotation++;
      this.flipAfterRotate();
    });
  }

  moveLeft() {
    this.transform = {
      ...this.transform,
      translateH: ++this.translateH
    };
  }

  moveRight() {
    this.transform = {
      ...this.transform,
      translateH: --this.translateH
    };
  }

  moveTop() {
    this.transform = {
      ...this.transform,
      translateV: ++this.translateV
    };
  }

  moveBottom() {
    this.transform = {
      ...this.transform,
      translateV: --this.translateV
    };
  }

  private flipAfterRotate(): void {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
    this.translateH = 0;
    this.translateV = 0;
  }

  private flipHorizontal(): void {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH
    };
  }

  private flipVertical(): void {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV
    };
  }

  private resetImage(): void {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {
      translateUnit: 'px'
    };
  }

  private zoomOut(): void {
    this.scale -= .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  private zoomIn(): void {
    this.scale += .1;
    this.transform = {
      ...this.transform,
      scale: this.scale
    };
  }

  private toggleContainWithinAspectRatio(): void {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  private updateRotation(): void {
    this.transform = {
      ...this.transform,
      rotate: this.rotation
    };
  }

  private onSubmit(): void {
    if (this.uploadImageForm.invalid) {
      this.uploadImageForm.setErrors({ ...this.uploadImageForm.errors, 'uploadImageForm': true });

      if (this.uploadImageForm.controls.title.errors.maxlength) {
        this.subs.push(
          this.translocoService.selectTranslate('ImageUploadComponent.TitlePlaceholderError', { imageTitleMaxLength: this.imageTitleMaxLength }).subscribe(value => this.titlePlaceholder = value)
        );
      }

      return;
    }
    else if (this.uploadImageForm.valid) {
      const uploadModel = this.uploadImageForm.value;
      const formData = new FormData();
      const image: any = this.croppedImage;
      image.lastModifiedDate = new Date();
      image.name = 'tempname';
      formData.append('image', image);
      formData.append('title', uploadModel.title as string);

      this.uploadingPhoto = true;

      this.subs.push(
        this.imageService.uploadImage(formData)
          .subscribe({
            next: (res: any) => {
              if (res.status == 200) {
              }
            },
            complete: () => {
              this.toggleDisplay.emit();
            },
            error: () => {
              this.openErrorDialog(this.translocoService.translate('CouldNotUploadImage'), null);
              this.toggleDisplay.emit();
            }
          })
      );
    }
  }

  private openErrorDialog(title: string, error: string): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error
      }
    });
  }
}
