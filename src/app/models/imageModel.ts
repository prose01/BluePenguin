export class ImageModel {
  imageId: string;
  fileName: string;
  title: string;
  image: string = '../assets/default-person-icon.png';
}

export interface ImageModel {
  imageId: string;
  fileName: string;
  title: string;
  image: string;
}
