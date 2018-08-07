
import { NgModule,ApplicationRef, ErrorHandler, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalState } from './global.state';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import { AppRoutingModule } from './app.routing';
import { PagesModule } from './pages/pages.module';
import { TimingInterceptor } from './shared/timing.interceptor';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { PatrolTrackerService } from './pages/patroltracker/patroltracker.service';
import { AuthGuard } from './guards/auth.guard';
import { fakeBackendProvider } from './helpers/fake.backend';
//import { CustomErrorHandler } from './CustomErrorHandler';
import { WindowRef } from './shared/services/window.service';
//import { GlobalErrorHandlerService } from './global-error-handler.service';
// import { GlobalErrorComponent }  from './global-error.component';
// import { PageNotFoundComponent }  from './page-not-found.component';
@NgModule({
  declarations: [
    AppComponent,
    // GlobalErrorComponent,
		// PageNotFoundComponent
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    PagesModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule
   
  ],
  providers: [AuthGuard,GlobalState, //{provide: ErrorHandler, useClass: CustomErrorHandler},
  //{provide: HTTP_INTERCEPTORS, useClass: ProgressInterceptor, multi: true, deps: [ProgressBarService]},
  {provide: HTTP_INTERCEPTORS, useClass: TimingInterceptor, multi: true},
  PatrolTrackerService,
  {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
  },WindowRef,fakeBackendProvider//GlobalErrorHandlerService,{ provide: ErrorHandler, useClass: GlobalErrorHandlerService }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
