import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject  } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Profile } from '../models/profile';
import { CurrentUser } from '../models/currentUser';
import { ProfileFilter } from '../models/profileFilter';

@Injectable()
export class ProfileService {

  private avalonUrl = 'http://localhost:49260/';  // URL to web api
  private headers: HttpHeaders;

  private currentUserSource = new BehaviorSubject<CurrentUser>(null);
  currentUserSubject = this.currentUserSource.asObservable();

  retrievedImage: any; // Is this being used?
  base64Data: any; // Is this being used?
  retrieveResonse: any; // Is this being used?


  constructor(private http: HttpClient, public router: Router) {
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

  //getCurrentUserProfile(): Observable<CurrentUser> {
  //  return this.http.get<CurrentUser[]>(`${this.avalonUrl}CurrentUser`, { headers: this.headers })
  //    .pipe(
  //      map(currentUser => currentUser),
  //      tap(h => {
  //        const outcome = h ? `fetched` : `did not find`;
  //      }),
  //      catchError(this.handleError)
  //    );
  //}

  addProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.avalonUrl}CurrentUser`, currentUser, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  putProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.put<CurrentUser>(`${this.avalonUrl}CurrentUser`, currentUser, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCurrentUser(): Observable<CurrentUser> {
    return this.http.delete(`${this.avalonUrl}CurrentUser`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //uploadImage(formData: FormData): Observable<any> {
  //  return this.http.post(`${this.avalonUrl}UploadImage`, formData, {
  //    reportProgress: true,
  //    observe: 'events'
  //  });
  //}

  //getImageByFileName(fileName: string): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.avalonUrl}GetImageByFileName/${fileName}`, { headers: this.headers })
  //    .pipe(
  //      catchError(this.handleError)
  //    );
  //}

  //deleteImage(imageId: string[]): Observable<CurrentUser> {
  //  return this.http.post(`${this.avalonUrl}DeleteImage`, imageId, { headers: this.headers })
  //    .pipe(
  //      catchError(this.handleError)
  //    );
  //}

  saveProfileFilter(profileFilter: ProfileFilter): Observable<CurrentUser> {
    return this.http.post<CurrentUser>(`${this.avalonUrl}SaveProfileFilter`, profileFilter, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  loadProfileFilter(): Observable<ProfileFilter> {
    return this.http.get<ProfileFilter>(`${this.avalonUrl}LoadProfileFilter`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Does not work so use putProfile instead.
  patchProfile(currentUser: CurrentUser): Observable<CurrentUser> {
    return this.http.patch<CurrentUser>(`${this.avalonUrl}CurrentUser`, { prof: currentUser }, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  // Bookmarks
  addProfilesToBookmarks(profiles: string[]): Observable<Profile> {
    return this.http.post<Profile>(`${this.avalonUrl}AddProfilesToBookmarks`, profiles, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  removeProfilesFromBookmarks(profiles: string[]): Observable<Profile[]> {
    return this.http.post<Profile[]>(`${this.avalonUrl}RemoveProfilesFromBookmarks`, profiles, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getBookmarkedProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.avalonUrl}GetBookmarkedProfiles`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }




  // Profile

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.avalonUrl}GetAllProfiles`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getProfileById(profileId: string): Observable<Profile> {
    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfileById/${profileId}`, { headers: this.headers })
      .pipe(
        map(profile => profile),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
        }),
        catchError(this.handleError)
      );
  }

  setAsAdmin(profile: Profile): Observable<Profile> {
    return this.http.post(`${this.avalonUrl}SetAsAdmin`, profile, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  removeAdmin(profile: Profile): Observable<Profile> {
    return this.http.post(`${this.avalonUrl}RemoveAdmin`, profile, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //getProfilesById(profileIds: string[]): Observable<Profile[]> {
  //  return this.http.get<Profile[]>(`${this.avalonUrl}GetProfilesById/${profileIds}`, { headers: this.headers })
  //    .pipe(
  //      map(profile => profile),
  //      tap(h => {
  //        const outcome = h ? `fetched` : `did not find`;
  //      }),
  //      catchError(this.handleError)
  //    );
  //}

  getChatMemberProfiles(): Observable<Profile[]> {
    return this.http.post<Profile[]>(`${this.avalonUrl}GetChatMemberProfiles`, { headers: this.headers })
      .pipe(
        map(profile => profile),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
        }),
        catchError(this.handleError)
      );
  }

  blockChatMembers(profileIds: string[]): Observable<Profile[]> {
    return this.http.post<Profile[]>(`${this.avalonUrl}BlockChatMembers`, profileIds, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getProfileByFilter(profileFilter: ProfileFilter): Observable<Profile[]> {
    return this.http.post<ProfileFilter[]>(`${this.avalonUrl}GetProfileByFilter`, profileFilter, { headers: this.headers })
      .pipe(
        map(profile => profile),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
        }),
        catchError(this.handleError)
      );
  }

  getProfileByCurrentUsersFilter(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.avalonUrl}GetProfileByCurrentUsersFilter`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  getLatestCreatedProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.avalonUrl}GetLatestCreatedProfiles`, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //getLastUpdatedProfiles(): Observable<Profile[]> {
  //  return this.http.get<Profile[]>(`${this.avalonUrl}GetLastUpdatedProfiles`, { headers: this.headers })
  //    .pipe(
  //      catchError(this.handleError)
  //    );
  //}

  //getLastActiveProfiles(): Observable<Profile[]> {
  //  return this.http.get<Profile[]>(`${this.avalonUrl}GetLastActiveProfiles`, { headers: this.headers })
  //    .pipe(
  //      catchError(this.handleError)
  //    );
  //}
  
  deleteProfiles(profiles: string[]): Observable<Profile> {
    return this.http.post(`${this.avalonUrl}DeleteProfiles`, profiles, { headers: this.headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  //getProfileImages(profileId: string): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.avalonUrl}GetProfileImages/${profileId}`, { headers: this.headers })
  //    .pipe(
  //      catchError(this.handleError)
  //    );
  //}

  //getProfileImageByFileName(profileId: string, fileName: string): Observable<any[]> {
  //  return this.http.get<any[]>(`${this.avalonUrl}GetProfileImageByFileName/${profileId},${fileName}`, { headers: this.headers })
  //    .pipe(
  //      catchError(this.handleError)
  //    );
  //}


  // Helper Lav en rigtig error handler inden produktion
  // https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
  // Husk at opdater GET, POST etc this.handleError!
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
