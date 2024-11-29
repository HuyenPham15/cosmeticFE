import { HttpInterceptorFn } from '@angular/common/http';
import { Injectable } from '@angular/core';
 import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
 import { Observable } from 'rxjs';
import { emit } from 'process';
 
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const email = localStorage.getItem('email');
    if (email) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Basic ${btoa(email + ':' + localStorage.getItem('password'))}`)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}