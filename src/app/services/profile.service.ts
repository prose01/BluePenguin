import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Profile } from '../models/profile';

@Injectable()
export class ProfileService {

  private profilesUrl = 'http://localhost:49260/Profiles/';  // URL to web api
  private profilesQueryUrl = 'http://localhost:49260/ProfilesQuery/';  // URL to web api
    private headers: HttpHeaders;

    private currentProfileSource = new BehaviorSubject(new Profile());
    currentProfile = this.currentProfileSource.asObservable();

    constructor(private http: HttpClient) {
        this.headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
    }

    updateCurrentProfile(profile: Profile) {
      this.currentProfileSource.next(profile)
    }
    
    getCurrentUserProfile<Data>(): Observable<Profile> {
        return this.http.get<Profile[]>(`${this.profilesUrl}GetCurrentUserProfile`, { headers: this.headers })
            .pipe(
                map(profile => profile),
                tap(h => {
                    const outcome = h ? `fetched` : `did not find`;
                    //this.log(`${outcome} profile profileId=${profileId}`);
                }),
                catchError(this.handleError)
            );
    }

    getProfiles(): Observable<Profile[]> {
        return this.http.get<Profile[]>(this.profilesUrl, { headers: this.headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    getProfile<Data>(profileId: string): Observable<Profile> {
        return this.http.get<Profile[]>(`${this.profilesUrl}${profileId}`, { headers: this.headers })
            .pipe(
                map(profile => profile),
                tap(h => {
                    const outcome = h ? `fetched` : `did not find`;
                    //this.log(`${outcome} profile profileId=${profileId}`);
                }),
                catchError(this.handleError)
            );
    }

    addProfile(profile: Profile): Observable<Profile> {
        return this.http.post<Profile>(this.profilesUrl, profile, { headers: this.headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    putProfile(profile: Profile): Observable<Profile> {
        return this.http.put<Profile>(this.profilesUrl, profile, { headers: this.headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    // Does not work so use putProfile instead.
    patchProfile(profile: Profile): Observable<Profile> {
        return this.http.patch<Profile>(this.profilesUrl, { prof: profile }, { headers: this.headers })
            .pipe(
                catchError(this.handleError)
            );
    }


    // Bookmarks
    addFavoritProfiles(profiles: string[]): Observable<Profile> {
        return this.http.post<Profile>(`${this.profilesUrl}AddProfilesToBookmarks`, profiles, { headers: this.headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    removeFavoritProfiles(profiles: string[]): Observable<Profile[]> {   
        return this.http.post<Profile[]>(`${this.profilesUrl}RemoveProfilesFromBookmarks`, profiles, { headers: this.headers })
            .pipe(
                catchError(this.handleError)
            );
    }

    getBookmarkedProfiles(): Observable<Profile[]> {
      return this.http.get<Profile[]>(`${this.profilesQueryUrl}GetBookmarkedProfiles`, { headers: this.headers })
        .pipe(
          catchError(this.handleError)
        );
    }

    // Helper Lav en rigtig error handler inden produktion
    // https://stackblitz.com/angular/jyrxkavlvap?file=src%2Fapp%2Fheroes%2Fheroes.service.ts
    // Husk at opdater GET, POST etc this.handleError!
    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
