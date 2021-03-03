import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { AutoUnsubscribe, takeWhileAlive } from 'take-while-alive';
import { BehaviorSubject, Observable, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { OrderByType } from "../models/enums";
import { Profile } from "../models/profile";
import { ProfileService } from "./profile.service";

@AutoUnsubscribe()
export class ProfilesDataSource implements DataSource<Profile> {

  private profilensSubject = new BehaviorSubject<Profile[]>([]);
  currentProfilesSubject = this.profilensSubject.asObservable();

  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private profileService: ProfileService) { }

  loadProfiles(orderByType: OrderByType, sortDirection: string, pageIndex: string, pageSize: string) {
    this.loadingSubject.next(true);

    //this.profileService.getLatestProfiles(orderByType, sortDirection, pageIndex, pageSize).pipe(
    //  takeWhileAlive(this),
    //  catchError(() => of([])),
    //  finalize(() => this.loadingSubject.next(false))
    //)
    //  .subscribe(lessons => this.profilensSubject.next(lessons));
  }

  connect(collectionViewer: CollectionViewer): Observable<Profile[]> {
    console.log("Connecting data source");
    return this.profilensSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    console.log("Disconnecting data source");
    this.profilensSubject.complete();
    this.loadingSubject.complete();
  }

}
