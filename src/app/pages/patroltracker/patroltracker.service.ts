import { Injectable, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Langlat } from '../langlat';
import { Observable } from 'rxjs';
import { LoggerService } from '../../shared/services/logger.service';
import { catchError }               from 'rxjs/operators';
import 'rxjs/add/observable/throw';

@Injectable()
export class PatrolTrackerService {
   
    constructor(public http: HttpClient,private injector: Injector) { }
    private handleError(operation: String) {
        return (err: any) => {
          
            if(err instanceof HttpErrorResponse) {
                // you could extract more info about the error if you want, e.g.:
                console.log(`status: ${err.status}, ${err.statusText}`);
                // errMsg = ...
            }
            return Observable.throw(err);
        }
    }
    getDirectionRoute(langlat:Langlat):Observable<any>{
        try {
           return this.http.get(environment.directionsURL+langlat.startLang+','+langlat.startLat+';'+langlat.endLang+','+langlat.endLat+'.json?geometries=polyline&steps=true&overview=full&access_token='+environment.accessTokenMapbox).pipe(
        
            catchError(this.handleError('getData'))
        );
        } catch (error) {
            //let loggerService = this.injector.get(LoggerService);
            LoggerService.setError(error);
            //return error; 
        }
        //145.180533,-37.952297;144.959936,-37.815563?steps=true&geometries=geojson&access_token=pk.eyJ1Ijoid3lra3NzIiwiYSI6ImNqMjR6aTdmdzAwNHMzMnBvbjBucjlqNm8ifQ.6GjGpofWBVaIuSnhdXQb5w
        //return this.http.get(environment.directionsURL+langlat.startLang+','+langlat.startLat+';'+langlat.endLang+','+langlat.endLat+'?steps=true&geometries=geojson&access_token='+environment.accessTokenMapbox);
       // return this.http.get(environment.directionsURL+langlat.startLang+','+langlat.startLat+';'+langlat.endLang+','+langlat.endLat+'.json?geometries=polyline&steps=true&overview=full&access_token='+environment.accessTokenMapbox);
    }
    validateLink(params){
        //console.log("-------- ",params);
        if(params){
            return 1;
        }
        sessionStorage.removeItem("patrolservice");
        return 0;
    }
    sendFeedback(formData:any){
        return this.http.post<any>('/api/feedback',formData);
    }
    getBreakDownDetails(jobid:string):Observable<any>{
        return this.http.get('/api/details/'+jobid);
    }
    getPatrolLocation(index:number):Observable<any>{
        return this.http.get('/api/location/'+index);
    }
    // reverseGeocoading(){
    //     return this.http.get('https://api.mapbox.com/v4/geocode/mapbox.places/144.9824198,-37.85566.json?access_token='+environment.accessTokenMapbox);
    // }
    getDataFromAPI(){
        var header = new HttpHeaders();
        header.set('Content-Type','application/json');
        header.append('Accept', 'application/json');
        header.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, DELETE, PUT');
        header.append('Access-Control-Allow-Origin', '*');
        header.append('Access-Control-Allow-Headers', "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");
       
        return this.http.get('https://800be087.ngrok.io/details?key1=51634446',{headers:header });
    }
}
