import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
 
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        debugger;
        let currentPS = JSON.parse(sessionStorage.getItem('patrolservice'));
        // if (currentPS && currentPS.token) {
        //     request = request.clone({
        //         setHeaders: { 
        //             Authorization: `Bearer ${currentPS.token}`
        //         }
        //     });
        // }
         return next.handle(request);
    }
}