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

import { ImageCroppedEvent, ImageTransform } from '../image-cropper/interfaces/index';
import { base64ToFile } from '../image-cropper/utils/blob.utils';
import { Subscription } from 'rxjs';

import { ImageService } from '../../services/image.service';
import { ErrorDialog } from '../../error-dialog/error-dialog.component';

@Component({
  selector: 'image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})

export class ImageUploadComponent implements OnInit, OnDestroy {
  private subs: Subscription[] = [];
  public uploadImageForm: FormGroup;
  public imageChangedEvent: any = '';
  private croppedImage: any = null;
  public canvasRotation = 0;
  private rotation = 0;
  private scale = 1;
  public showCropper = false;
  private containWithinAspectRatio = false;
  public transform: ImageTransform = {};
  private fileUploadProgress: string = null;
  private titlePlaceholder: string;
  public uploadingPhoto: boolean = false;
  private fileSizeLimit: number;
  private imageTitleMaxLength: number;
  private imageMaxWidth: number;
  private imageMaxHeight: number;

  @Output("toggleDisplay") toggleDisplay: EventEmitter<any> = new EventEmitter();

  constructor(private imageService: ImageService, private formBuilder: FormBuilder, private dialog: MatDialog, private configurationLoader: ConfigurationLoader, private readonly translocoService: TranslocoService) {
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
        this.openErrorDialog(this.translocoService.translate("ImageUploadComponent.CouldNotUploadImage"), this.translocoService.translate("ImageUploadComponent.ImageSizeLimit", { limitMB: Math.floor(limitMB) }));
      }
    }
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64;
  }

  imageLoaded(): void {
    this.showCropper = true;
  }

  loadImageFailed(): void {
    //console.log('Load failed');
  }

  private rotateLeft(): void {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  private rotateRight(): void {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate(): void {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH
    };
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
    this.transform = {};
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
      const image: any = base64ToFile(this.croppedImage);
      image.lastModifiedDate = new Date();
      image.name = 'tempname';

      this.resizeImage(image, this.imageMaxWidth, this.imageMaxHeight).then(res => {
        formData.append('image', res);
        formData.append('title', uploadModel.title as string);
        this.uploadingPhoto = true;
        this.subs.push(
          this.imageService.uploadImage(formData)
          .subscribe({
            next: (res: any) =>  {
              if (res.status == 200) {
              }
            },
            complete: () => {
              this.toggleDisplay.emit(); 
            },
            error: () => {
              //this.openErrorDialog("Could not save image", error.error);
              this.toggleDisplay.emit();
            }
          })
        );
      });
    }
  }

  // Hack to resize image before upload - https://jsfiddle.net/ascorbic/wn655txt/2/   // TODO: Should not resize if already big enough, and should no make bigger than fileSizeLimit.
  private resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      let image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        let width = image.width;
        let height = image.height;

        if (width <= maxWidth && height <= maxHeight) {
          resolve(file);
        }

        let newWidth;
        let newHeight;

        if (width > height) {
          newHeight = height * (maxWidth / width);
          newWidth = maxWidth;
        } else {
          newWidth = width * (maxHeight / height);
          newHeight = maxHeight;
        }

        let canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;

        let context = canvas.getContext('2d');

        context.drawImage(image, 0, 0, newWidth, newHeight);

        context.canvas.toBlob(resolve, file.type);
      };
      image.onerror = reject;
    });
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
