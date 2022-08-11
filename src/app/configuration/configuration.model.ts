export type Configuration = {
  avalonUrl: string;
  artemisUrl: string;
  junoUrl: string;
  genderTypes: string[];
  maxTags: number;
  maxPhotos: number;
  fileSizeLimit: number;
  imageMaxWidth: number;
  imageMaxHeight: number;
  imageTitleMaxLength: number;
  defaultAge: number;
  defaultPageSize: number;
  randomImagePlace: number;
  adGroup: number;
  adGroupProfile: number;
  languageList: Array<any>;
  countryList: Array<any>;
  showGlobalInfo: boolean;
}
