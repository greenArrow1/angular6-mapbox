import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { LngLatLike, LngLatBounds, Map } from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { MatBottomSheet, ICON_REGISTRY_PROVIDER_FACTORY, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { JobdetailComponent } from './jobdetail/jobdetail.component';
import { Router, ActivatedRoute } from '@angular/router';
import { PatrolTrackerService } from './patroltracker.service';
import { FeatureCollection } from '@turf/helpers';
import { interval, Subscription, throwError, } from 'rxjs';
import { animationFrameScheduler } from 'rxjs';
import { PolyLineService } from './polyline.service';
import { SharedModule } from '../../shared/shared.module';
import { log } from 'util';
import { parse } from 'url';
import { WindowRef } from '../../shared/services/window.service';
import { LoggerService } from '../../shared/services/logger.service';
import { Dialog } from './dialog/dialog.component';
import { environment } from '../../../environments/environment';
//import { hmTouchEvents } from 'hammerjs';
declare var turf: any; //importing turf library features in variable turf.
declare var Hammer: any;
export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'patroltracker',
  templateUrl: './patroltracker.html',
  styleUrls: ['./patroltracker.css']
})
export class PatrolTrackerComponent implements OnInit, OnDestroy {
  truckId: any;
  eventId: any;
  animal: string;
  name: string;
  state: any;
  isLoading: boolean = true;
  map: Map;
  @ViewChild(JobdetailComponent) child: JobdetailComponent;
  details: boolean = false;
  sourceLang: any;
  sourceLat: any;
  destinationLang: any;
  destinationLat: any;
  private currentZoomLevel = 10;
  private changeDetectorRef: ChangeDetectorRef;
  data: GeoJSON.FeatureCollection<GeoJSON.LineString>;
  routes: any = {
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [0, 0],
          [0, 0]
        ]
      }
    }]
  };
  tapCounter = 0;
  eventCounter:any;
  clickEvent = new EventEmitter<Event>();
  /**
   * plotting route on map
   */

  isSettings: boolean = false;
  center: LngLatLike;
  zoom = [0];
  pitch: number;
  paint: any = {
    'line-color': '#0099FF',
    'line-opacity': 0.80,
    'line-width': 5
  };
  /**
   * plotting and altering marker
   * and its behaviour on map
   */
  showMarker: boolean = false;
  index = -1;
  req: any;
  req2: any;
  req3: any;
  req4: any;
  coords: any = [];
  handleId: any
  counter: number = 0;
  angle: string = 'rotate(0deg)';
  estimatedTime: number = 0;
  estimatedDistance: number = 0;
  selectedPoint: boolean = false;
  options: any = {};
  errorCounter: number = 0;
  alert(message: string) {
    alert(message);
  }
  /**
   * CSS for rotating marker on Map
  */
  rotateMarker = {
    '-ms-transform': 'rotate(-20deg)',
    '-webkit-transform': 'rotate(-20deg)',
    'transform': 'rotate(-20deg)',
    'transition': 'transform 1s',
    'transition-timing-function': 'ease'
  }
  timerMarker: Subscription;
  timerMarkerError: Subscription;
  destfeature: any = {
    'type': 'Feature',
    'properties': {
      'description': 'Breakdown service request details.'
    },
    'geometry': {
      'type': 'Point',
      'coordinates': [
        0, 0
      ]
    }
  };
  /** Destination marker coordinates
   *  and other properties seeting
  */
  feature: any = {
    'type': 'Feature',
    'properties': {
      'description': 'Foo',
      'iconSize': [60, 60]
    },
    'geometry': {
      'type': 'Point',
      'coordinates': [
        0,
        0
      ]
    }
  };
  featureCollection: FeatureCollection = {
    "type": "FeatureCollection",
    "features": []
  };

  constructor(private activeRoute: ActivatedRoute, private elRef: ElementRef,
    private router: Router,
    public http: HttpClient,
    public bottomSheet: MatBottomSheet,
    private patrolservice: PatrolTrackerService,
    private PolyLineService: PolyLineService,
    public ngZone: NgZone, changeDetectorRef: ChangeDetectorRef, public windowRef: WindowRef, public dialog: MatDialog) {
    this.changeDetectorRef = changeDetectorRef;
    //console.log(hmTouchEvents);
  }

  //  ngAfterViewInit() {
  //    this.elRef.nativeElement.querySelector('.mapboxgl-ctrl-zoom-out');
  //  }
  /**
   * Material bottom triggering function
   */
  openBottomSheet(): void {
    // this.bottomSheet.open(JobdetailComponent);
    //this.router.navigate(['./pages/patroltracker/:jobid/jobdetails']);
    this.details = true;
    this.state = 'enter';

  }
  /** 
   * getting route and other details
   * using source and destination
   * coordinates.      
  */
  getRoute() {

    this.options = {
      "coords": { startLang: this.sourceLang, startLat: this.sourceLat, endLang: this.destinationLang, endLat: this.destinationLat }
    }
    //this.ngOnInit();
  }
  //bounds: any = [[145.180533, -37.952297], [144.959936, -37.815563]];
  bounds: any;
  ngOnInit() {


    //GET Location
    /* this.patrolservice.getLocation().subscribe(success => {

      // this.truckId = success.truckId;
      // this.eventId = success.eventId;
      if (success.truckId && success.eventId == undefined) {
        console.log("tracking for this job has expired");
      }
      else {
        console.log("Details" + success.truckId, success.eventId);
      }
    }, error => {
      if (error.status == 410 || error.status == 404) {
        console.log("tracking for this job has expired");
      }
      else if (error.status == 201) {
        console.log('Invalid Job');
      }
      else {
        console.log(error.message);
      }
    }); */

    //GET Details
    /*  this.patrolservice.getDetails(JSON.parse(localStorage.getItem('patrolservice')).eventid).subscribe(success => {
     }, error => { console.log(error) });
  */


    if (this.patrolservice.validateLink(this.activeRoute.snapshot.params.eventid, this.activeRoute.snapshot.params.truckid) == 1) {
      this.storeToken();
      if (this.sourceLang == "" || !this.sourceLang) {
        this.options = {
          "coords": { startLang: 145.180533, startLat: -37.952297, endLang: 144.959936, endLat: -37.815563 }
        }
      }

      if (this.req3) {
        this.req3.unsubscribe();
      }
      this.destfeature.geometry.coordinates = [this.options.coords.endLang, this.options.coords.endLat]
      this.req3 = this.patrolservice.getBreakDownDetails(this.activeRoute.snapshot.params.eventid).subscribe(data => {
        this.options.coords.endLang = data.longitude;
        this.options.coords.endLat = data.latitude;
        if (this.req4) {
          this.req4.unsubscribe();
        }
        /**
         * getting patrol vehicle location by source coordinates.
         */
        this.req4 = this.patrolservice.getPatrolLocation(this.activeRoute.snapshot.params.eventid, this.activeRoute.snapshot.params.truckid).subscribe(pdata => {

          this.options.coords.startLang = pdata.longitude;
          this.options.coords.startLat = pdata.latitude;
          this.zoom = [this.currentZoomLevel];
          this.pitch = 30;
          let coords: any[] = JSON.parse(localStorage.getItem('coords')) || [];
          this.center = [this.options.coords.endLang, this.options.coords.endLat];

          this.bounds = [[this.options.coords.endLang, this.options.coords.endLat], [this.options.coords.startLang, this.options.coords.startLat]];

          this.timerMarker = interval(6000, animationFrameScheduler).subscribe(() => {
            this.index++;
            // this.index == coords.length - 1 ---replace with complete status
            if (pdata.status == 'COMPLETE' || pdata.status == 'CANCELED' || this.options.coords.startLang == 0 || this.options.coords.startLat == 0 || this.options.coords.endLang == 0 || this.options.coords.endLat == 0) {
              this.endRoute();
            } else {
              this.isLoading = false;
              this.createRoutes(this.options.coords);
            }
          });
        }, error => {
          if (error.status == 500) {
            this.createRoutes(this.options.coords);

          }
          else if (error.status == 410 || error.status == 404) {
            LoggerService.setError(error);
            this.router.navigate(["/home"]);
          }
        });
      }, error => {
        LoggerService.setError(error);
        this.router.navigate(["/home"]);
      });
    }
  }
  /**
   * Creates the route by hitting Mapbox direction API,
   * the response comes with distance, duration ,etc of the route.
   * @param longLat has the object of source and desination coordinates.
   */

  private createRoutes(longLat) {
    if (this.req) {
      this.req.unsubscribe();
    }

    this.req = this.patrolservice.getDirectionRoute(longLat).subscribe(response => {
      this.counter = 0;
      this.estimatedTime = Math.round((response.routes[0].duration) / 60);
      this.estimatedDistance = response.routes[0].distance;
      response.routes[0].geometry = this.PolyLineService.toGeoJSON(response.routes[0].geometry, 5);
      this.featureCollection.features = response.routes;
      const data: GeoJSON.FeatureCollection<GeoJSON.LineString> = <any>this.featureCollection;
      this.data = Object.assign({}, data);
      //throw new Error('This request has failed '); 
      const routes: any = {
        "type": "FeatureCollection",
        "features": [{
          "type": "Feature",
          "geometry": {
            "type": "LineString",
            "coordinates": [
              [0, 0],
              [0, 0]
            ]
          }
        }]
      };

      const coordinates = this.data.features[0].geometry.coordinates;
      this.coords = this.data.features[0].geometry.coordinates;
      routes.features[0].geometry.coordinates[0] = this.coords[0];
      routes.features[0].geometry.coordinates[1] = this.coords[1];
      this.routes = JSON.parse(JSON.stringify(routes));
      /**
       * angel calculates the rotation angle.
       */
      var angel: string = this.trunBasedOnBearing2(this.data);//this.trunBasedOnBearing(response.routes[0].legs[0].steps,coordinates[0]);
      this.rotateMarker["-ms-transform"] = angel;
      this.rotateMarker["-webkit-transform"] = angel;
      this.rotateMarker.transform = angel;
      this.rotateMarker = Object.assign({}, this.rotateMarker);

      if (this.index == 0) {
        localStorage.setItem('coords', JSON.stringify(coordinates));
        this.zoomToBounds();
      }
      this.showMarker = true;
      this.index++;
      this.feature = JSON.parse(JSON.stringify(this.feature));
      this.routePath();

      if (this.req2) {
        this.req2.unsubscribe();
      }
      this.req2 = this.patrolservice.getPatrolLocation(this.activeRoute.snapshot.params.eventid, this.activeRoute.snapshot.params.truckid).subscribe(pdata => {
         this.tapCounter++;
        if (this.tapCounter == 1) {
          var context = Object.assign(this);
         // var square = document.getElementsByClassName('mapboxgl-ctrl-icon mapboxgl-ctrl-compass');
         var square = document.getElementById('mapper');
          debugger
          // Create a manager to manager the element
          var manager = new Hammer.Manager(square);

          // Create a recognizer
          // var DoubleTap = new Hammer.Tap({
          //   event: 'click'
          // });
          var DoubleTap = new Hammer.Tap({
            event: "tap",
            taps: 2,
            pointerType: Hammer.POINTER_TOUCH
        });
      //   var Tap = new Hammer.Tap({
      //     event: "tap",
      //     taps: 1,
      //     pointerType: Hammer.POINTER_TOUCH
      // });

          // Add the recognizer to the manager
          manager.add(DoubleTap);
          //manager.add(Tap);

          // Subscribe to desired event
          manager.on('tap', (e) => {
            var square = document.getElementsByClassName('mapboxgl-ctrl-icon mapboxgl-ctrl-compass');
            square[0].addEventListener("click", ()=>{
              this.zoomOndblClick();
          });

          // var square1 = document.getElementById('mapper');
          //   square1.addEventListener("click", ()=>{
          //     this.zoomOndblClick();
          // });


              this.pitch = 30;
           /*   
            
                const coordinates = this.data.features[0].geometry.coordinates;
               this.bounds = coordinates.reduce((bounds, coord) => {
                 return bounds.extend(<any>coord);
               }, new LngLatBounds(coordinates[0], coordinates[0]));
               this.zoomOndblClick();
            // debugger
            this.clickEvent.emit(e); */
          });
          
        }  
        // add condition on status recieved;
        if (pdata.status == 'COMPLETE' || pdata.status == 'CANCELED') {
          this.endRoute();

        } else if (pdata.status == 'REASSIGNED') {
          ///------------To DO----------
        }

        this.options.coords.startLang = pdata.longitude;
        this.options.coords.startLat = pdata.latitude;
        if (this.timerMarkerError) { this.timerMarkerError.unsubscribe(); }
        //this.zoomToBounds();
        //this.createRoutes(this.options.coords);
      }, error => {
        this.timerMarkerError = interval(30000, animationFrameScheduler).subscribe(() => {
          this.errorCounter++;
          if (this.errorCounter > 4) {
            this.openDialog();
            this.timerMarkerError.unsubscribe();
          } else {
            this.createRoutes(this.options.coords);
          }
        });

      });
    }, err => {
      console.log(err);
      LoggerService.setError(err);
      this.router.navigate(["/home"]);
    });
  }
  /**
   * calculate bounds<LngLatBounds>
   * to fit map around the given marker(s) coordinates .
   */
  zoomToBounds() {
    //this.ngZone.runOutsideAngular(() => {
     const coordinates = this.data.features[0].geometry.coordinates;
    this.bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(<any>coord);
    }, new LngLatBounds(coordinates[0], coordinates[0]));
  //});
    //
    //   if( this.map){
    //     this.map.fitBounds(this.bounds);
    //   }
     
    // });
  }
  /**
   * check for various options provided in settings.
   * Each option has given some parameter for conditional statements.
   * @param key is the conditional string for various options in settings.
   * @param value opacity value(number).
   */
  setOption(key, value) {
    if (key == 'routepath') {
      this.paint = Object.assign({
        'line-color': 'blue',
        'line-opacity': value,
        'line-width': 7
      })
      //console.log("----------------- ",key,value);
    }
    if (key == 'destination') {
      this.center = [this.options.coords.endLang, this.options.coords.endLat];
    }
    if (key == 'source') {
      this.center = [this.data.features[0].geometry.coordinates[0][0], this.data.features[0].geometry.coordinates[0][1]];
    }
    if (key == 'zoom') {
      this.pitch = 30;
      this.zoomToBounds();
    }
  }
  /**
   * animate the patrol marker for smooth navigation.
   */
  animate() {
    if (this.counter < this.coords.length) {
      this.ngZone.runOutsideAngular(() => {

        const feature: any = {
          'type': 'Feature',
          'properties': {
            'description': 'Foo',
            'iconSize': [60, 60]
          },
          'geometry': {
            'type': 'Point',
            'coordinates': [
              0,
              0
            ]
          }
        };
        feature.geometry.coordinates = this.routes.features[0].geometry.coordinates[this.counter];
        this.feature = JSON.parse(JSON.stringify(feature));
        this.handleId = window.requestAnimationFrame(() => { this.animate(); });
      });
    }
    this.counter = this.counter + 1;
  }
  /**
   * clears the timeMarker interval subscription,
   * route the application to the feedback page.
   */
  private endRoute() {
    if (this.timerMarker) {
      this.counter = this.coords.length;

      this.timerMarker.unsubscribe();
    }

    window.location.href = "https://staging.racv.com.au/cb-test/track-my-patrol.html"; //https://staging.racv.com.au/cb-test/track-my-patrol.appview.html

  }

  timer: Subscription;
  private routePath() {

    var lineDistance = turf.lineDistance(this.routes.features[0], 'kilometers');

    var arc = [];

    // Number of steps to use in the arc and animation, more steps means
    // a smoother arc and animation, but too many steps will result in a
    // low frame rate
    var steps = 100;

    // Draw an arc between the `origin` & `destination` of the two points
    for (var i = 0; i < lineDistance; i += lineDistance / steps) {
      var segment = turf.along(this.routes.features[0], i, 'kilometers');
      arc.push(segment.geometry.coordinates);
    }
    // Update the route with calculated arc coordinates
    this.routes.features[0].geometry.coordinates = [];
    this.routes.features[0].geometry.coordinates = arc;
    /* 
    for(let i=0 ; i<=this.data.features[0].geometry.coordinates.length;i++){
      if(arc[i]  && this.data.features[0].geometry.coordinates[i][0] == arc[i][0] && this.data.features[0].geometry.coordinates[i][1] == arc[i][1]){
        this.data.features[0].geometry.coordinates.splice(i,1);
        //console.log(i);
      }
      
    } */


    var i = 0;
    if (this.timer) {
      this.timer.unsubscribe();
    }

    this.timer = interval(0, animationFrameScheduler).subscribe(() => {
      if (i < this.routes.features[0].geometry.coordinates.length - 1) {
        if (i < this.routes.features[0].geometry.coordinates.length) {

          const feature: any = {
            'type': 'Feature',
            'properties': {
              'description': 'Foo',
              'iconSize': [60, 60]
            },
            'geometry': {
              'type': 'Point',
              'coordinates': [
                0,
                0
              ]
            }
          };

          feature.geometry.coordinates = this.routes.features[0].geometry.coordinates[i];

          //setTimeout(() => {
          this.feature = JSON.parse(JSON.stringify(feature));
          // }, 1550);

        }
        i++;
      }
      else {
        this.timer.unsubscribe();

      }

    });

  }
  private storeToken() {
    sessionStorage.setItem("patrolservice", JSON.stringify({
      "eventid": this.activeRoute.snapshot.params.eventid,
      "truckid": this.activeRoute.snapshot.params.truckid,
      "token": environment.apiauthkey
    }));
  }
  onClick(detail: any) {
    this.selectedPoint = true;
  }
  popupClose() {
    this.selectedPoint = false;
  }
  private trunBasedOnBearing(steps, currentCoord) {
    steps.forEach(element => {
      if (element.maneuver.location[0] == currentCoord[0] && element.maneuver.location[1] == currentCoord[1]) {
        this.angle = 'rotate(' + (element.maneuver.bearing_after) + 'deg)';
        return this.angle;
      }
    });
    return this.angle;
  }
  /**
   * calculate bearing and then degrees to rotate the marker with the turf library functions. 
   * @param routes is the direction API response featureCollection in const data object.
   */
  private trunBasedOnBearing2(routes) {
    var angle = 'rotate(' + (turf.bearing(
      turf.point(routes.features[0].geometry.coordinates[this.counter]),
      turf.point(routes.features[0].geometry.coordinates[this.counter + 1])
    )) + 'deg)';
    return angle;
  }

  ngOnDestroy() {

    this.timerMarker ? this.timerMarker.unsubscribe() : '';
    this.req4 ? this.req4.unsubscribe() : '';
    this.req3 ? this.req3.unsubscribe() : '';
    if (this.req2) { this.req2.unsubscribe(); }

    if (this.req) { this.req.unsubscribe(); }
  }
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.windowRef.nativeWindow.digitalData = {
        page: {
          pageName: "pages/patroltracker", // set page name 
          siteSection: " relaxed-meninsky-dd0ec4.netlify ", // set domain/sub-domain name
          server: "relaxed-meninsky-dd0ec4.netlify.com" // set domain/sub-domain name
        },
      };
      this.windowRef.nativeWindow._satellite.pageBottom();
      //console.log("adobe" + window._satellite.pageBottom());
      //this.$carousel = $(this.el.nativeElement).slick({});
    });
  }
  /**
   * open side setting toolbox.
   * user can show/hide the route on/from map.
   * reset the zoom level.
   */
  openSettings() {
    this.isSettings = !this.isSettings;
  }
  zoomOndblClick() {
    // var zoomLevel = this.map.getZoom();
    // if(zoomLevel>0){
    //   zoomLevel--;
      // this.ngZone.runOutsideAngular(() => {
      //   this.map.setZoom(this.currentZoomLevel);
      //   this.map.fitBounds(this.bounds);
      // });
    // }
    //this.elRef.nativeElement.querySelector('.mapboxgl-ctrl-zoom-out').click();
    
    this.zoomToBounds();
    
   
  }
  hideChildWindow(status) {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    this.state = 'leave';
    this.details = status;
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(Dialog, {
      width: '300px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }
  // touchStart(event){
  //   var time1 = new Date();
  //  debugger
  // }
  // touchEnd(event) {
  //   debugger
  // }
  tapped(event){
   
    console.log(event.timeStamp);
    console.log(event.lngLat);
    if(this.eventCounter){
    if( this.eventCounter - event.originalEvent.timeStamp < 300) {
      this.zoomOndblClick;
      this.eventCounter=undefined;
    }
    else{
      return
    }
    }
    else this.eventCounter = event.originalEvent.timeStamp;
   

  }
  abc(event){
    console.log(event.lngLat);
  }
}

