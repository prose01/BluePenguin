import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ProfileFilter } from "../models/profileFilter";


@Injectable()
export class BehaviorSubjectService {

  // ProfileFilter observable.
  private currentProfileFilterSource = new BehaviorSubject<ProfileFilter>(null);
  currentProfileFilterSubject = this.currentProfileFilterSource.asObservable();


  async updateCurrentProfileFilterSubject(filter: ProfileFilter) {
    this.currentProfileFilterSource.next(filter);
  }
}
