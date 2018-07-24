import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
 
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    
    constructor() { }
 
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let patrolservice: any[] = JSON.parse(sessionStorage.getItem('patrolservice')) || [];
       
        return of(null).pipe(mergeMap(() => {
            if (request.url.endsWith('/api/tokenauthenticate') && request.method === 'POST') {
                debugger
                let filteredPs = patrolservice.filter(ps => {
                    return ps.token === request.body.tocken;
                });
                if (filteredPs.length) {
                    let ps = filteredPs[0];
                    let body = {
                        tocken: ps.token,
                        retoken: 'fake-jwt-token'
                    };
                    return of(new HttpResponse({ status: 200, body: body }));
                } else {
                    return throwError('provided token is not valid');
                }
            }
 
            if (request.url.endsWith('/api/patroledetail') && request.method === 'GET') {
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: patrolservice }));
                } else {
                    return throwError('Unauthorised');
                }
            }
            if (request.url.endsWith('/api/feedback') && request.method === 'POST') {

                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return of(new HttpResponse({ status: 200, body: patrolservice }));
                } else {
                    return throwError('Unauthorised');
                }
            }
            if (request.url.match(/\/api\/details\/\D+$/) && request.method === 'GET') {
                
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    return of(new HttpResponse({ status: 200, body: {"latitude": -37.815563,
                    "longitude": 144.959936,
                } }));
                } else {
                    return throwError('Unauthorised');
                }
            }
            
            if (request.url.match(/\/api\/location\/-1+$/) && request.method === 'GET') {
                
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    if(id==-1){
                        return of(new HttpResponse({ status: 200, body: {"latitude": -37.952297,
                        "longitude": 145.180533
                            } }));
                    }
                    return of(new HttpResponse({ status: 200, body: {"latitude": 0,
                    "longitude": 0,
                        } }))
                } else {
                    return throwError('Unauthorised');
                }
            }
            if (request.url.match(/\/api\/location\/\d+$/) && request.method === 'GET') {
                let coords: any[] = JSON.parse(localStorage.getItem('coords')) || [];
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    let urlParts = request.url.split('/');
                    let id = parseInt(urlParts[urlParts.length - 1]);
                    if(id==-1){
                        return of(new HttpResponse({ status: 200, body: {"latitude": -37.952297,
                        "longitude": 145.180533
                            } }));
                    }
                    for(var i=0; i<coords.length;i++){
                        if(i==id){
                            return of(new HttpResponse({ status: 200, body: {"latitude": coords[i][1],
                        "longitude": coords[i][0],
                            } }))
                        }
                    }
                    return of(new HttpResponse({ status: 200, body: {"latitude": 0,
                    "longitude": 0,
                        } }))
                } else {
                    return throwError('Unauthorised');
                }
            }
                      
            return next.handle(request);
        })) 
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }
}
 
export let fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};