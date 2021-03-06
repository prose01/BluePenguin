import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ProfileFilter } from "../models/profileFilter";
import { Profile } from "../models/profile";


@Injectable()
export class BehaviorSubjectService {

  // ProfileFilter observable.
  private currentProfileFilterSource = new BehaviorSubject<ProfileFilter>(null);
  currentProfileFilterSubject = this.currentProfileFilterSource.asObservable();


  async updateCurrentProfileFilterSubject(filter: ProfileFilter) {
    this.currentProfileFilterSource.next(filter);
  }


  // SearchResultProfiles observable.
  private currentSearchResultProfilesSource = new BehaviorSubject<Profile[]>(null);
  currentSearchResultProfilesSubject = this.currentSearchResultProfilesSource.asObservable();


  async updateCurrentSearchResultProfilesSubject(profiles: Profile[]) {
    this.currentSearchResultProfilesSource.next(profiles);
  }

}
