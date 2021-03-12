import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject, throwError  } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Profile } from '../models/profile';
import { CurrentUser } from '../models/currentUser';
import { ProfileFilter } from '../models/profileFilter';
import { ConfigurationLoader } from "../configuration/configuration-loader.service";
import { OrderByType } from '../models/enums';

@Injectable()
export class ProfileService {

  private avalonUrl: string;
  private headers: HttpHeaders;

  private currentUserSource = new BehaviorSubject<CurrentUser>(null);
  currentUserSubject = this.currentUserSource.asObservable();

  retrievedImage: any; // Is this being used?
  base64Data: any; // Is this being used?
  retrieveResonse: any; // Is this being used?


  constructor(private configurationLoader: ConfigurationLoader, private http: HttpClient, public router: Router) {
    this.avalonUrl = configurationLoader.getConfiguration().avalonUrl;
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  }

  // CurrentUser

  async verifyCurrentUserProfile(): Promise<boolean> {
    const currentUser = await this.http.get<CurrentUser>(`${this.avalonUrl}CurrentUser`, { headers: this.headers }).toPromise();

    if (currentUser.auth0Id == null) {
      this.router.navigate(['/create']);

      return Promise.resolve(false);
    }

    // Use RxJS BehaviorSubject to hold CurrentUser for all other components.
    this.currentUserSource.next(currentUser);

    return Promise.resolve(true);
  }

  async updateCurrentUserSubject() {
    const currentUser = await this.http.get<CurrentUser>(`${this.avalonUrl}CurrentUser`, { headers: this.headers }).toPromise();
    this.currentUserSource.next(currentUser);
  }

  addProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.avalonUrl}CurrentUser`, currentUser, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  putProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.put<CurrentUser>(`${this.avalonUrl}CurrentUser`, currentUser, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  deleteCurrentUser(): Observable<{}> {
    return this.http.delete(`${this.avalonUrl}CurrentUser`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  saveProfileFilter(profileFilter: ProfileFilter): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.avalonUrl}SaveProfileFilter`, profileFilter, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  loadProfileFilter(): Observable<ProfileFilter> {
    return this.http.get<ProfileFilter>(`${this.avalonUrl}LoadProfileFilter`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  // Does not work so use putProfile instead.
  patchProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.patch<CurrentUser>(`${this.avalonUrl}CurrentUser`, { prof: currentUser }, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }


  // Bookmarks
  addProfilesToBookmarks(profiles: string[]): Observable<Profile> {   // TODO: Should not return all profiles
    return this.http.post<Profile>(`${this.avalonUrl}AddProfilesToBookmarks`, profiles, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  removeProfilesFromBookmarks(profiles: string[]): Observable<Profile[]> {  // TODO: Should not return all profiles
    return this.http.post<Profile[]>(`${this.avalonUrl}RemoveProfilesFromBookmarks`, profiles, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getBookmarkedProfiles(pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetBookmarkedProfiles`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }




  // Profile

  getProfiles(): Observable<Profile[]> { // TODO: Should not return all profiles
    return this.http.get<Profile[]>(`${this.avalonUrl}GetAllProfiles`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfileById(profileId: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.avalonUrl}GetProfileById/${profileId}`, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  deleteProfiles(profiles: string[]): Observable<{}> {
    return this.http.post(`${this.avalonUrl}DeleteProfiles`, profiles, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  setAsAdmin(profile: Profile): Observable<any> {
    return this.http.post(`${this.avalonUrl}SetAsAdmin`, profile, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  removeAdmin(profile: Profile): Observable<any> {
    return this.http.post(`${this.avalonUrl}RemoveAdmin`, profile, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getChatMemberProfiles(pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetChatMemberProfiles`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  blockChatMembers(profileIds: string[]): Observable<Profile[]> { // TODO: Should not return all profiles
    return this.http.post<Profile[]>(`${this.avalonUrl}BlockChatMembers`, profileIds, { headers: this.headers })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfileByFilter(profileFilter: ProfileFilter, orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.post<Profile[]>(`${this.avalonUrl}GetProfileByFilter`, { profileFilter, orderByType }, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getProfileByCurrentUsersFilter(orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfileByCurrentUsersFilter/`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }

  getLatestProfiles(orderByType: OrderByType, pageIndex: string, pageSize: string): Observable<Profile[]> {
    const params = new HttpParams()
      .set('OrderByType', orderByType)
      .set('PageIndex', pageIndex)
      .set('PageSize', pageSize);

    return this.http.get<Profile[]>(`${this.avalonUrl}GetLatestProfiles/`, { headers: this.headers, params: params })
      .pipe(
        retry(3),
        catchError(this.handleError)
      );
  }


  // Helper Lav en rigtig error handler inden produktion
  // https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
  // Husk at opdater GET, POST etc this.handleError!
  //private handleError(error: any): Promise<any> {
  //  console.error('An error occurred', error); // for demo purposes only
  //  return Promise.reject(error.message || error);
  //}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }
}
