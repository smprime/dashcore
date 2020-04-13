import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BittrexComponent } from './bittrex.component';

const routes: Routes = [
  { path: '', component: BittrexComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BittrexRoutingModule { }
