import { Routes, RouterModule }  from '@angular/router';
import { FeedbackComponent } from './feedback.component';
import { NgModule } from '@angular/core';
// noinspection TypeScriptValidateTypes
export const routes: Routes = [
  {
    path: '',
    component: FeedbackComponent
   }  
];

//export const routing: ModuleWithProviders = RouterModule.forChild(routes);
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackRoutingModule { }