export class ImageModel {
  imageId: string;
  fileName: string;
  title: string;
  image: string = '../assets/default-person-icon.jpg';
}

export interface ImageModel {
  imageId: string;
  fileName: string;
  title: string;
  image: string;
}
