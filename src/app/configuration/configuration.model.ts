export type Configuration = {
  avalonUrl: string;
  artemisUrl: string;
  junoUrl: string;
  genderTypes: string[];
  sexualOrientationTypes: string[];
  maxTags: number;
  maxPhotos: number;
  fileSizeLimit: number;
  imageMaxWidth: number;
  imageMaxHeight: number;
  defaultAge: number;
  defaultPageSize: number;
  languageList: Array<any>;
  countryList: Array<any>;
}
