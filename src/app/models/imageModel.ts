export class ImageModel {
  imageId: string;
  fileName: string;
  title: string;
  image: string = '../assets/default-person-icon.jpeg';
}

export interface ImageModel {
  imageId: string;
  fileName: string;
  title: string;
  image: string;
}
