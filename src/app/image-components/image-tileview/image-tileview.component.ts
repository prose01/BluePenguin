import { Component, Input } from '@angular/core';

import { AuthService } from '../../auth/auth.service';

import { ImageModel } from '../../models/imageModel';

@Component({
  selector: 'image-tileview',
  templateUrl: './image-tileview.component.html',
  styleUrls: ['./image-tileview.component.css']
})

export class ImageTileviewComponent {

  selectedImageModel: ImageModel;

  @Input() imageModels: ImageModel[];

  constructor(public auth: AuthService) { }
}
