// gallery image
export interface GALLERY_IMAGE {
  url: string; // url of the image
  thumbnailUrl?: string; // thumbnail url (recommended), if not present, gallery will use `url` property to get thumbnail image.
  altText?: string; // alt text for image
  title?: string; // title of the image
  extUrl?: string; // external url of image
  extUrlTarget?: string; // external url target e.g. '_blank', '_self' etc.
}
