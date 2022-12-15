export type Configuration = {
  avalonUrl: string;
  artemisUrl: string;
  junoUrl: string;
  useChat: boolean;
  genderTypes: string[];
  maxTags: number;
  maxPhotos: number;
  fileSizeLimit: number;
  imageMaxWidth: number;
  imageMaxHeight: number;
  imageTitleMaxLength: number;
  minAge: number;
  maxAge: number;
  minHeight: number;
  maxHeight: number;
  defaultPageSize: number;
  randomImagePlace: number;
  adGroup: number;
  adGroupProfile: number;
  languageList: Array<any>;
  countryList: Array<any>;
  showGlobalInfo: boolean;
}
