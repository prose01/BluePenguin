import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ProfileService } from '../services/profile.service';
import { ImageService } from '../services/image.service';
import { AuthService } from './../authorisation/auth/auth.service';
import { ProfileFilter } from '../models/profileFilter';
import { Profile } from '../models/profile';
import { ImageModel } from '../models/ImageModel';
import {
  GenderType,
  BodyType,
  SmokingHabitsType,
  HasChildrenType,
  WantChildrenType,
  HasPetsType,
  LivesInType,
  EducationType,
  EducationStatusType,
  EducationLevelType,
  EmploymentStatusType,
  SportsActivityType,
  EatingHabitsType,
  ClotheStyleType,
  BodyArtType,
  SexualOrientationType,
  OrderByType
} from '../models/enums';
import { CurrentUser } from '../models/currentUser';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent implements OnInit {
  filter: ProfileFilter = new ProfileFilter();
  searchResultProfiles: Profile[];
  profileForm: FormGroup;
  ageList: number[] = [...Array(1 + 120 - 16).keys()].map(v => 16 + v);
  heightList: number[] = [...Array(1 + 250 - 0).keys()].map(v => 0 + v);
  weightList: number[] = [...Array(1 + 700 - 0).keys()].map(v => 0 + v);
  genderTypes = Object.keys(GenderType);
  bodyTypes = Object.keys(BodyType);
  smokingHabitsTypes = Object.keys(SmokingHabitsType);
  hasChildrenTypes = Object.keys(HasChildrenType);
  wantChildrenTypes = Object.keys(WantChildrenType);
  hasPetsTypes = Object.keys(HasPetsType);
  livesInTypes = Object.keys(LivesInType);
  educationTypes = Object.keys(EducationType);
  educationStatusTypes = Object.keys(EducationStatusType);
  educationLevelTypes = Object.keys(EducationLevelType);
  employmentStatusTypes = Object.keys(EmploymentStatusType);
  sportsActivityTypes = Object.keys(SportsActivityType);
  eatingHabitsTypes = Object.keys(EatingHabitsType);
  clotheStyleTypes = Object.keys(ClotheStyleType);
  bodyArtTypes = Object.keys(BodyArtType);

  currentUserSubject: CurrentUser;
  showGenderChoise: boolean;

  constructor(public auth: AuthService, private profileService: ProfileService, private imageService: ImageService, private formBuilder: FormBuilder) { this.createForm(); }

  createForm() {
    this.profileForm = this.formBuilder.group({
      name: null,
      age: null,
      height: null,
      weight: null,
      description: null,
      gender: GenderType.Female,
      body: BodyType.NotChosen,
      smokingHabits: SmokingHabitsType.NotChosen,
      hasChildren: HasChildrenType.NotChosen,
      wantChildren: WantChildrenType.NotChosen,
      hasPets: HasPetsType.NotChosen,
      livesIn: LivesInType.NotChosen,
      education: EducationType.NotChosen,
      educationStatus: EducationStatusType.NotChosen,
      educationLevel: EducationLevelType.NotChosen,
      employmentStatus: EmploymentStatusType.NotChosen,
      sportsActivity: SportsActivityType.NotChosen,
      eatingHabits: EatingHabitsType.NotChosen,
      clotheStyle: ClotheStyleType.NotChosen,
      bodyArt: BodyArtType.NotChosen
    });
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.profileService.verifyCurrentUserProfile().then(currentUser => {
        if (currentUser) {          
          this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; this.setShowGenderChoise(currentUserSubject.sexualOrientation) });          
        }
      });
    }
  }

  setShowGenderChoise(sexualOrientationType: SexualOrientationType) {
    this.showGenderChoise = (sexualOrientationType == SexualOrientationType.Heterosexual || sexualOrientationType == SexualOrientationType.Homosexual) ? false : true;
  }

  loadForm() {
    this.profileForm.reset({
      name: this.filter.name,
      age: this.filter.age,
      height: this.filter.height,
      weight: this.filter.weight,
      description: this.filter.description,
      gender: this.filter.gender,
      body: this.filter.body,
      smokingHabits: this.filter.smokingHabits,
      hasChildren: this.filter.hasChildren,
      wantChildren: this.filter.wantChildren,
      hasPets: this.filter.hasPets,
      livesIn: this.filter.livesIn,
      education: this.filter.education,
      educationStatus: this.filter.educationStatus,
      educationLevel: this.filter.educationLevel,
      employmentStatus: this.filter.employmentStatus,
      sportsActivity: this.filter.sportsActivity,
      eatingHabits: this.filter.eatingHabits,
      clotheStyle: this.filter.clotheStyle,
      bodyArt: this.filter.bodyArt
    });
  }

  onSubmit() {
    this.filter = this.prepareSearch();
    this.profileService.getProfileByFilter(this.filter, OrderByType.CreatedOn).subscribe(searchResultProfiles => this.searchResultProfiles = searchResultProfiles);

    setTimeout(() => { this.getProfileImages(); }, 500); 
  }

  getProfileImages(): void {
    let defaultImageModel: ImageModel = new ImageModel();
    this.imageService.getProfileImageByFileName('0', 'person-icon').subscribe(images => defaultImageModel.image = 'data:image/png;base64,' + images.toString());

    this.searchResultProfiles.forEach((element, i) => {
      if (element.images != null && element.images.length > 0) {
        // Take a random image from profile.
        let imageNumber = this.randomIntFromInterval(0, element.images.length - 1);
        //Just insert it into the first[0] element as we will only show one image.
        this.imageService.getProfileImageByFileName(element.profileId, element.images[imageNumber].fileName).subscribe(images => element.images[0].image = 'data:image/png;base64,' + images.toString());
      }
      else {
        // Set default profile image.
        element.images.push(defaultImageModel);
      }
    });
  }

  randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  revert() {
    this.createForm();
    this.searchResultProfiles = [];
  }

  prepareSearch(): ProfileFilter {
    const formModel = this.profileForm.value;

    const filterProfile: ProfileFilter = {
      name: formModel.name as string,
      createdOn: new Date() as Date,
      updatedOn: new Date() as Date,
      lastActive: new Date() as Date,
      age: formModel.age as number[],
      height: formModel.height as number[],
      weight: formModel.weight as number[],
      description: formModel.description as string,
      gender: formModel.gender as GenderType,
      body: formModel.body as BodyType,
      smokingHabits: formModel.smokingHabits as SmokingHabitsType,
      hasChildren: formModel.hasChildren as HasChildrenType,
      wantChildren: formModel.wantChildren as WantChildrenType,
      hasPets: formModel.hasPets as HasPetsType,
      livesIn: formModel.livesIn as LivesInType,
      education: formModel.education as EducationType,
      educationStatus: formModel.educationStatus as EducationStatusType,
      educationLevel: formModel.educationLevel as EducationLevelType,
      employmentStatus: formModel.employmentStatus as EmploymentStatusType,
      sportsActivity: formModel.sportsActivity as SportsActivityType,
      eatingHabits: formModel.eatingHabits as EatingHabitsType,
      clotheStyle: formModel.clotheStyle as ClotheStyleType,
      bodyArt: formModel.bodyArt as BodyArtType
    };
    console.log(filterProfile);
    return filterProfile;
  }

  saveSearch() {
    this.filter = this.prepareSearch();
    this.profileService.saveProfileFilter(this.filter).subscribe();
  }

  loadSearch() {
    this.profileService.loadProfileFilter().subscribe(filter => this.filter = filter);

    //setTimeout(() => { this.loadForm(); }, 1000);     // TODO: this.filter.body er undefined og fejler.

    this.profileForm.markAsDirty();
  }
}
