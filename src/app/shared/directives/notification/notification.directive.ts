import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
 
import { NotificationService } from './notification.service';
 
@Component({
    selector: 'notification',
    templateUrl: './notification.directive.html'
})
 
export class NotificationComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;
 
    constructor(private notificationService: NotificationService) { }
 
    ngOnInit() {
        this.subscription = this.notificationService.getMessage().subscribe(message => { 
            this.message = message; 
        });
    }
 
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}