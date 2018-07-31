
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './pages.routing';
import { Pages } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import {HeaderComponent} from '../shared/components/header/header.component';
import { GreetingsComponent } from './greetings/greetings.component';
import {FooterComponent} from '../shared/components/footer/footer.component';
import {NotificationComponent} from '../shared/directives/notification/notification.directive';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@NgModule({
  imports: [CommonModule, AppRoutingModule,SharedModule],
  declarations: [Pages,HeaderComponent,GreetingsComponent,FooterComponent,NotificationComponent],
  providers:[
    {
        provide: 'externalUrlRedirectResolver',
        useValue: (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
        {
            window.location.href = (route.data as any).externalUrl;
        }
    }
]
})
export class PagesModule {
}
