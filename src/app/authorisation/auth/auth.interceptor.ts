import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {  

  constructor(private authService: AuthService) {
  }

  private isAuthenticated() : Observable<boolean> {
    return from(Promise.resolve(this.authService.isAuthenticated()));
  }

  private getAccessToken() : Observable<string> {
    return from(Promise.resolve(this.authService.getAccessToken()));
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.isAuthenticated().pipe(mergeMap((isAuthenticated) => {
      if (!isAuthenticated) {
        return next.handle(request);
      }

      return this.getAccessToken().pipe(mergeMap((accessToken) => {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          return next.handle(request);
        }))

        //.mergeMap((accessToken) => {
        //  request = request.clone({
        //    setHeaders: {
        //      Authorization: `Bearer ${accessToken}`
        //    }
        //  });
        //  return next.handle(request);
        //})


    }

    ));

      //.mergeMap((isAuthenticated) => {
      //if (!isAuthenticated) {
      //  return next.handle(request);
      //}

      //return this.getAccessToken().mergeMap((accessToken) => {
      //    request = request.clone({
      //      setHeaders: {
      //        Authorization: `Bearer ${accessToken}`
      //      }
      //    });
      //    return next.handle(request);
      //  })
    //});
  }

  

}
