import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SPACE, ENTER } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { TranslocoService } from '@ngneat/transloco';
import { Subscription } from 'rxjs';

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
  public minHeight: number;
  public maxHeight: number;

  @Output() getProfileByFilter: EventEmitter<any> = new EventEmitter();
  @Output() toggleDisplay: EventEmitter<any> = new EventEmitter();
  @Output() activateSearch: EventEmitter<any> = new EventEmitter();


  constructor(private enumMappings: EnumMappingService, private profileService: ProfileService, private behaviorSubjectService: BehaviorSubjectService, private formBuilder: FormBuilder, private configurationLoader: ConfigurationLoader, private dialog: MatDialog, private readonly translocoService: TranslocoService) {
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
          setTimeout(() => {
            this.loadForm(currentProfileFilterSubject);
            this.profileForm.markAsDirty();
            this.activateSearch.emit({ allowSearch: true });
          }, 100);

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
      this.enumMappings.clotheStyleTypeSubject.subscribe(value => this.clotheStyleTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateClotheStyleTypeSubject();

    this.subs.push(
      this.enumMappings.bodyTypeSubject.subscribe(value => this.bodyTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateBodyTypeSubject();

    this.subs.push(
      this.enumMappings.bodyArtTypeSubject.subscribe(value => this.bodyArtTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateBodyArtTypeSubject();

    this.subs.push(
      this.enumMappings.eatingHabitsTypeSubject.subscribe(value => this.eatingHabitsTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateEatingHabitsTypeSubject();

    this.subs.push(
      this.enumMappings.educationStatusTypeSubject.subscribe(value => this.educationStatusTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateEducationStatusTypeSubject();

    this.subs.push(
      this.enumMappings.educationTypeSubject.subscribe(value => this.educationTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateEducationTypeSubject();

    this.subs.push(
      this.enumMappings.employmentStatusTypesSubject.subscribe(value => this.employmentStatusTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateEmploymentStatusTypeSubject();

    this.subs.push(
      this.enumMappings.hasChildrenTypesSubject.subscribe(value => this.hasChildrenTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateHasChildrenTypeSubject();

    this.subs.push(
      this.enumMappings.wantChildrenTypesSubject.subscribe(value => this.wantChildrenTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateWantChildrenTypeSubject();

    this.subs.push(
      this.enumMappings.hasPetsTypeSubject.subscribe(value => this.hasPetsTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateHasPetsTypeSubject();

    this.subs.push(
      this.enumMappings.livesInTypeSubject.subscribe(value => this.livesInTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateLivesInTypeSubject();

    this.subs.push(
      this.enumMappings.smokingHabitsTypeSubject.subscribe(value => this.smokingHabitsTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateSmokingHabitsTypeSubject();

    this.subs.push(
      this.enumMappings.sportsActivityTypeSubject.subscribe(value => this.sportsActivityTypes = this.stripNotChosen(value))
    );
    this.enumMappings.updateSportsActivityTypeSubject();    
  } 
  
  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
    this.subs = [];
  }

  private stripNotChosen(obj: any): any {
    var types = new Map<string, string>()

    for (let k of obj.keys()) {
      if (k != 'NotChosen')
        types.set(k, obj.get(k))
    }

    return types;
  }

  private createForm(): void {
    this.profileForm = this.formBuilder.group({
      name: null,
      minAgeSliderControl: this.minAge,
      maxAgeSliderControl: this.maxAge,
      minHeightSliderControl: this.minHeight,
      maxHeightSliderControl: this.maxHeight,
      heightSliderControl: null,
      description: null,
      tags: null,
      gender: null,
      body: null,
      smokingHabits: null,
      hasChildren: null,
      wantChildren: null,
      hasPets: null,
      livesIn: null,
      education: null,
      educationStatus: null,
      employmentStatus: null,
      sportsActivity: null,
      eatingHabits: null,
      clotheStyle: null,
      bodyArt: null
    });
  }

  private loadForm(filter: ProfileFilter): void {
    if (filter != null) {
      this.profileForm.reset({
        name: filter.name,
        minAgeSliderControl: filter.age[0] == null ? this.minAge : filter.age[0],
        maxAgeSliderControl: filter.age[1] == null ? this.maxAge : filter.age[1],
        minHeightSliderControl: filter.height[0] == null ? this.minHeight : filter.height[0],
        maxHeightSliderControl: filter.height[1] == null ? this.maxHeight : filter.height[1],
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
    else {
      this.profileForm.markAsPristine();
      this.activateSearch.emit({ allowSearch: false });
    }
  }

  onSubmit(): void {
    this.filter = this.prepareSearch();

    // Just return if no search input.
    if (this.filter.name == null &&
      this.filter.age[1] == this.minAge &&
      this.filter.height[1] == this.minHeight &&
      this.filter.description == null &&
      this.filter.tags.length == 0 &&
      this.filter.body.length == 0 &&
      this.filter.smokingHabits.length == 0 &&
      this.filter.hasChildren.length == 0 &&
      this.filter.wantChildren.length == 0 &&
      this.filter.hasPets.length == 0 &&
      this.filter.livesIn.length == 0 &&
      this.filter.education.length == 0 &&
      this.filter.educationStatus.length == 0 &&
      this.filter.employmentStatus.length == 0 &&
      this.filter.sportsActivity.length == 0 &&
      this.filter.eatingHabits.length == 0 &&
      this.filter.clotheStyle.length == 0 &&
      this.filter.bodyArt.length == 0) {

      return;
    }

    this.behaviorSubjectService.updateCurrentProfileFilterSubject(this.filter);
    this.getProfileByFilter.emit();
  }

  reset(): void {
    this.tagsList.length = 0;
    this.profileForm.reset();
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

    const filterProfile: ProfileFilter = {
      name: formModel.name as string,
      age: [formModel.minAgeSliderControl as number, formModel.maxAgeSliderControl as number],
      height: [formModel.minHeightSliderControl as number, formModel.maxHeightSliderControl as number],
      description: formModel.description as string,
      tags: this.tagsList as string[],
      gender: formModel.gender as GenderType,
      body: formModel.body as Array<BodyType>,
      smokingHabits: formModel.smokingHabits as Array<SmokingHabitsType>,
      hasChildren: formModel.hasChildren as Array<HasChildrenType>,
      wantChildren: formModel.wantChildren as Array<WantChildrenType>,
      hasPets: formModel.hasPets as Array<HasPetsType>,
      livesIn: formModel.livesIn as Array<LivesInType>,
      education: formModel.education as Array<EducationType>,
      educationStatus: formModel.educationStatus as Array<EducationStatusType>,
      employmentStatus: formModel.employmentStatus as Array<EmploymentStatusType>,
      sportsActivity: formModel.sportsActivity as Array<SportsActivityType>,
      eatingHabits: formModel.eatingHabits as Array<EatingHabitsType>,
      clotheStyle: formModel.clotheStyle as Array<ClotheStyleType>,
      bodyArt: formModel.bodyArt as Array<BodyArtType>
    };

    return filterProfile;
  }

  saveSearch(): void {
    this.loading = true;

    this.filter = this.prepareSearch();

    // Just return if no search input.
    if (this.filter.name == null &&
      this.filter.age[1] == this.minAge &&
      this.filter.height[1] == this.minHeight &&
      this.filter.description == null &&
      this.filter.tags.length == 0 &&
      this.filter.body.length == 0 &&
      this.filter.smokingHabits.length == 0 &&
      this.filter.hasChildren.length == 0 &&
      this.filter.wantChildren.length == 0 &&
      this.filter.hasPets.length == 0 &&
      this.filter.livesIn.length == 0 &&
      this.filter.education.length == 0 &&
      this.filter.educationStatus.length == 0 &&
      this.filter.employmentStatus.length == 0 &&
      this.filter.sportsActivity.length == 0 &&
      this.filter.eatingHabits.length == 0 &&
      this.filter.clotheStyle.length == 0 &&
      this.filter.bodyArt.length == 0) {

      this.loading = false;
      return;
    }

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
