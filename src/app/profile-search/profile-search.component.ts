import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';
import { Options } from '@angular-slider/ngx-slider';

import { EnumMappingService } from '../services/enumMapping.service';
import { ProfileService } from '../services/profile.service';
import { BehaviorSubjectService } from '../services/behaviorSubjec.service';
import { ErrorDialog } from '../error-dialog/error-dialog.component';
import { ProfileFilter } from '../models/profileFilter';
import { CurrentUser } from '../models/currentUser';
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
  EmploymentStatusType,
  SportsActivityType,
  EatingHabitsType,
  ClotheStyleType,
  BodyArtType
} from '../models/enums';
import { ConfigurationLoader } from '../configuration/configuration-loader.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.scss']
})

export class ProfileSearchComponent implements OnInit, OnDestroy {
  private isTileView = true;
  private matButtonToggleText: string = 'ListView';
  private matButtonToggleIcon: string = 'line_style';
  public loading: boolean = false;

  private filter: ProfileFilter = new ProfileFilter();
  public profileForm: FormGroup;
  private genderTypes: ReadonlyMap<string, string>;
  public bodyTypes: ReadonlyMap<string, string>;
  public smokingHabitsTypes: ReadonlyMap<string, string>;
  public hasChildrenTypes: ReadonlyMap<string, string>;
  public wantChildrenTypes: ReadonlyMap<string, string>;
  public hasPetsTypes: ReadonlyMap<string, string>;
  public livesInTypes: ReadonlyMap<string, string>;
  public educationTypes: ReadonlyMap<string, string>;
  public educationStatusTypes: ReadonlyMap<string, string>;
  public employmentStatusTypes: ReadonlyMap<string, string>;
  public sportsActivityTypes: ReadonlyMap<string, string>;
  public eatingHabitsTypes: ReadonlyMap<string, string>;
  public clotheStyleTypes: ReadonlyMap<string, string>;
  public bodyArtTypes: ReadonlyMap<string, string>;

  private subs: Subscription[] = [];
  private currentUserSubject: CurrentUser;
  private currentProfileFilterSubject: ProfileFilter;
  public tagsPlaceholder: string;
  private maxTags: number;

  public minAge: number;
  public maxAge: number;
  public AgeOptions: Options = {
    floor: 0,
    ceil: 125,
    noSwitching: true
  };

  public minHeight: number;
  public maxHeight: number;
  public HeightOptions: Options = {
    floor: 0,
    ceil: 300,
    noSwitching: true
  };

  @Output() getProfileByFilter: EventEmitter<any> = new EventEmitter();
  @Output() toggleDisplay: EventEmitter<any> = new EventEmitter();
  @Output() activateSearch: EventEmitter<any> = new EventEmitter();


  constructor(private enumMappings: EnumMappingService, private profileService: ProfileService, private behaviorSubjectService: BehaviorSubjectService, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader, private dialog: MatDialog, private readonly translocoService: TranslocoService) {
    this.AgeOptions.floor = this.configurationLoader.getConfiguration().minAge;
    this.minAge = this.configurationLoader.getConfiguration().minAge;
    this.maxAge = this.configurationLoader.getConfiguration().maxAge;
    this.minHeight = this.configurationLoader.getConfiguration().minHeight;
    this.maxHeight = this.configurationLoader.getConfiguration().maxHeight;
    this.maxTags = this.configurationLoader.getConfiguration().maxTags;
    this.createForm();
  }

  ngOnInit(): void {
    this.subs.push(
      this.profileService.currentUserSubject.subscribe(currentUserSubject => { this.currentUserSubject = currentUserSubject; })
    );

    // Get and load previous ProfileFilter.
    this.subs.push(
      this.behaviorSubjectService.currentProfileFilterSubject.subscribe(currentProfileFilterSubject => {
        if (currentProfileFilterSubject) {
          this.loadForm(currentProfileFilterSubject);
          this.profileForm.markAsDirty();
          this.activateSearch.emit({ allowSearch: true });
        }
      })
    );

    this.subs.push(
      this.profileForm.statusChanges.subscribe(value => {
        if (this.profileForm.status == 'VALID') {
          this.activateSearch.emit({ allowSearch: true });
        }
        else {
          this.activateSearch.emit({ allowSearch: false });
        }
      })
    );

    this.subs.push(
      this.translocoService.selectTranslate('Tags').subscribe(value => this.tagsPlaceholder = value)
    );

    this.subs.push(
      this.enumMappings.genderTypeSubject.subscribe(value => this.genderTypes = value)
    );
    this.enumMappings.updateGenderTypeSubject();

    this.subs.push(
      this.enumMappings.clotheStyleTypeSubject.subscribe(value => this.clotheStyleTypes = value)
    );
    this.enumMappings.updateClotheStyleTypeSubject();

    this.subs.push(
      this.enumMappings.bodyTypeSubject.subscribe(value => this.bodyTypes = value)
    );
    this.enumMappings.updateBodyTypeSubject();

    this.subs.push(
      this.enumMappings.bodyArtTypeSubject.subscribe(value => this.bodyArtTypes = value)
    );
    this.enumMappings.updateBodyArtTypeSubject();

    this.subs.push(
      this.enumMappings.eatingHabitsTypeSubject.subscribe(value => this.eatingHabitsTypes = value)
    );
    this.enumMappings.updateEatingHabitsTypeSubject();

    this.subs.push(
      this.enumMappings.educationStatusTypeSubject.subscribe(value => this.educationStatusTypes = value)
    );
    this.enumMappings.updateEducationStatusTypeSubject();

    this.subs.push(
      this.enumMappings.educationTypeSubject.subscribe(value => this.educationTypes = value)
    );
    this.enumMappings.updateEducationTypeSubject();

    this.subs.push(
      this.enumMappings.employmentStatusTypesSubject.subscribe(value => this.employmentStatusTypes = value)
    );
    this.enumMappings.updateEmploymentStatusTypeSubject();

    this.subs.push(
      this.enumMappings.hasChildrenTypesSubject.subscribe(value => this.hasChildrenTypes = value)
    );
    this.enumMappings.updateHasChildrenTypeSubject();

    this.subs.push(
      this.enumMappings.wantChildrenTypesSubject.subscribe(value => this.wantChildrenTypes = value)
    );
    this.enumMappings.updateWantChildrenTypeSubject();

    this.subs.push(
      this.enumMappings.hasPetsTypeSubject.subscribe(value => this.hasPetsTypes = value)
    );
    this.enumMappings.updateHasPetsTypeSubject();

    this.subs.push(
      this.enumMappings.livesInTypeSubject.subscribe(value => this.livesInTypes = value)
    );
    this.enumMappings.updateLivesInTypeSubject();

    this.subs.push(
      this.enumMappings.smokingHabitsTypeSubject.subscribe(value => this.smokingHabitsTypes = value)
    );
    this.enumMappings.updateSmokingHabitsTypeSubject();

    this.subs.push(
      this.enumMappings.sportsActivityTypeSubject.subscribe(value => this.sportsActivityTypes = value)
    );
    this.enumMappings.updateSportsActivityTypeSubject();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private createForm(): void {
    this.profileForm = this.formBuilder.group({
      name: null,
      ageSliderControl: null,
      heightSliderControl: null,
      description: null,
      tags: null,
      gender: null,
      body: BodyType.NotChosen,
      smokingHabits: SmokingHabitsType.NotChosen,
      hasChildren: HasChildrenType.NotChosen,
      wantChildren: WantChildrenType.NotChosen,
      hasPets: HasPetsType.NotChosen,
      livesIn: LivesInType.NotChosen,
      education: EducationType.NotChosen,
      educationStatus: EducationStatusType.NotChosen,
      employmentStatus: EmploymentStatusType.NotChosen,
      sportsActivity: SportsActivityType.NotChosen,
      eatingHabits: EatingHabitsType.NotChosen,
      clotheStyle: ClotheStyleType.NotChosen,
      bodyArt: BodyArtType.NotChosen
    });
  }

  private loadForm(filter: ProfileFilter): void {
    this.profileForm.reset({
      name: filter.name,
      ageSliderControl: filter.age == null ? [this.AgeOptions.floor, this.AgeOptions.ceil] : [filter.age[0], filter.age[1]],
      heightSliderControl: filter.height == null ? [this.HeightOptions.floor, this.HeightOptions.ceil] : [filter.height[0], filter.height[1]],
      description: filter.description,
      tags: filter.tags,
      gender: filter.gender,
      body: filter.body,
      smokingHabits: filter.smokingHabits,
      hasChildren: filter.hasChildren,
      wantChildren: filter.wantChildren,
      hasPets: filter.hasPets,
      livesIn: filter.livesIn,
      education: filter.education,
      educationStatus: filter.educationStatus,
      employmentStatus: filter.employmentStatus,
      sportsActivity: filter.sportsActivity,
      eatingHabits: filter.eatingHabits,
      clotheStyle: filter.clotheStyle,
      bodyArt: filter.bodyArt
    });

    this.tagsList = filter.tags;
  }

  onSubmit(): void {
    this.filter = this.prepareSearch();

    // Just return if no search input.
    if (this.filter.name == null &&
      this.filter.age[1] == 0 &&
      this.filter.height[1] == 0 &&
      this.filter.description == null &&
      this.filter.tags.length == 0 &&
      this.filter.body == BodyType.NotChosen &&
      this.filter.smokingHabits == SmokingHabitsType.NotChosen &&
      this.filter.hasChildren == HasChildrenType.NotChosen &&
      this.filter.wantChildren == WantChildrenType.NotChosen &&
      this.filter.hasPets == HasPetsType.NotChosen &&
      this.filter.livesIn == LivesInType.NotChosen &&
      this.filter.education == EducationType.NotChosen &&
      this.filter.educationStatus == EducationStatusType.NotChosen &&
      this.filter.employmentStatus == EmploymentStatusType.NotChosen &&
      this.filter.sportsActivity == SportsActivityType.NotChosen &&
      this.filter.eatingHabits == EatingHabitsType.NotChosen &&
      this.filter.clotheStyle == ClotheStyleType.NotChosen &&
      this.filter.bodyArt == BodyArtType.NotChosen) {

      this.toggleDisplay.emit();
      return;
    }
    this.behaviorSubjectService.updateCurrentProfileFilterSubject(this.filter);
    this.getProfileByFilter.emit();
  }

  reset(): void {
    this.tagsList.length = 0;
    this.profileForm.reset({
        ageSliderControl: [this.AgeOptions.floor, this.AgeOptions.ceil],
        heightSliderControl: [this.HeightOptions.floor, this.HeightOptions.ceil]
      }
    );
    this.createForm();

    this.subs.push(
      this.translocoService.selectTranslate('Tags').subscribe(value => this.tagsPlaceholder = value)
    );
    this.profileForm.controls.tags.setErrors({ 'incorrect': false });

    this.profileForm.markAsPristine();
    this.activateSearch.emit({ allowSearch: false });
    this.subs.push(
      this.profileForm.statusChanges.subscribe(value => {
        if (this.profileForm.status == 'VALID') {
          this.activateSearch.emit({ allowSearch: true });
        }
        else {
          this.activateSearch.emit({ allowSearch: false });
        }
      })
    );
  }

  private prepareSearch(): ProfileFilter {
    const formModel = this.profileForm.value;
    
    const heightRange: number[] = [0, Number(formModel.height)];

    const filterProfile: ProfileFilter = {
      name: formModel.name as string,
      age: formModel.ageSliderControl as number[],
      height: formModel.heightSliderControl as number[],
      description: formModel.description as string,
      tags: this.tagsList as string[],
      gender: formModel.gender as GenderType,
      body: formModel.body as BodyType,
      smokingHabits: formModel.smokingHabits as SmokingHabitsType,
      hasChildren: formModel.hasChildren as HasChildrenType,
      wantChildren: formModel.wantChildren as WantChildrenType,
      hasPets: formModel.hasPets as HasPetsType,
      livesIn: formModel.livesIn as LivesInType,
      education: formModel.education as EducationType,
      educationStatus: formModel.educationStatus as EducationStatusType,
      employmentStatus: formModel.employmentStatus as EmploymentStatusType,
      sportsActivity: formModel.sportsActivity as SportsActivityType,
      eatingHabits: formModel.eatingHabits as EatingHabitsType,
      clotheStyle: formModel.clotheStyle as ClotheStyleType,
      bodyArt: formModel.bodyArt as BodyArtType
    };

    return filterProfile;
  }

  saveSearch(): void {
    this.loading = true;

    this.filter = this.prepareSearch();
    this.subs.push(
      this.profileService.saveProfileFilter(this.filter)
      .subscribe({
        next: () => {
          this.openErrorDialog(this.translocoService.translate('SearchSaved'), null);
        }, 
        complete: () => { this.loading = false; },
        error: () => {
          this.loading = false;
          this.openErrorDialog(this.translocoService.translate('CouldNotSaveSearchFilter'), null);
        }
      })
    );
  }

  loadSearch(): void {
    this.loading = true;

    this.subs.push(
      this.profileService.loadProfileFilter()
      .subscribe({
        next: (filter: any) =>  { this.loadForm(filter); },
        complete: () => { this.loading = false; },
        error: () => {
          this.loading = false;
          this.openErrorDialog(this.translocoService.translate('CouldNotLoadSearchFilter'), null);
        }
      })
    );

    this.profileForm.markAsDirty();
  }


  // Tag section //
  private visible = true;
  private selectable = true;
  private removable = true;
  public addOnBlur = true;
  public readonly separatorKeysCodes: number[] = [ENTER, SPACE];
  public tagsList: string[] = [];

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Check for max number of tags.
    if (this.tagsList.length >= this.maxTags) {
      this.profileForm.controls.tags.setErrors({ 'incorrect': true });

      this.subs.push(
        this.translocoService.selectTranslate('MaxTags', { maxTags: this.maxTags }).subscribe(value => this.tagsPlaceholder = value)
      );

      // Reset the input value
      if (input) {
        input.value = null;
        event.chipInput.clear;
      }
      
      return;
    }

    // Add our tag
    if ((value || '').trim()) {

      // Check Max 20 characters long.
      if (value.trim().length >= 20) {
        this.profileForm.controls.tags.setErrors({ 'incorrect': true });

        this.subs.push(
          this.translocoService.selectTranslate('MaxTagsCharacters').subscribe(value => this.tagsPlaceholder = value)
        );

        // Reset the input value
        if (input) {
          input.value = null;
          event.chipInput.clear;
        }

        return;
      }

      this.subs.push(
        this.translocoService.selectTranslate('Tags').subscribe(value => this.tagsPlaceholder = value)
      );

      this.profileForm.controls.tags.setErrors(null);

      this.activateSearch.emit({ allowSearch: true });
      this.tagsList.push(value.trim());
      this.profileForm.markAsDirty();
    }

    // Reset the input value
    if (input) {
      input.value = '';
      event.chipInput.clear;
    }
  }

  private remove(tag: string): void {
    const index = this.tagsList.indexOf(tag);

    if (index >= 0) {
      this.tagsList.splice(index, 1);
      this.profileForm.markAsDirty();
    }
  }

  // Preserve original EnumMapping order
  originalOrder = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return 0;
  }

  private openErrorDialog(title: string, error: any): void {
    const dialogRef = this.dialog.open(ErrorDialog, {
      data: {
        title: title,
        content: error?.error
      }
    });
  }
}
