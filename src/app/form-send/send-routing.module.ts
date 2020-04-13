import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormSendComponent } from './form-send.component';

const routes: Routes = [
  { path: '', component: FormSendComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SendRoutingModule { }
