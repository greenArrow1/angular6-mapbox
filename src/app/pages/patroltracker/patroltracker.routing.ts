import { Routes, RouterModule }  from '@angular/router';
import { PatrolTrackerComponent } from './patroltracker.component';
import { ModuleWithProviders } from '@angular/core';

// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: PatrolTrackerComponent
   }  
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
