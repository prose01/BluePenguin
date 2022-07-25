import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ProfileFilter } from "../models/profileFilter";


@Injectable()
export class BehaviorSubjectService {

  // ProfileFilter observable.
  private currentProfileFilterSource = new BehaviorSubject<ProfileFilter>(null);
  public currentProfileFilterSubject = this.currentProfileFilterSource.asObservable();


  async updateCurrentProfileFilterSubject(filter: ProfileFilter): Promise<void> {
    this.currentProfileFilterSource.next(filter);
  }
}
