import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/form-send' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)},
  { path: 'form-send', loadChildren: () => import('./form-send/form-send.module').then(m => m.FormSendModule)},
  { path: 'merchant', loadChildren: () => import('./merchant/merchant.module').then(m => m.MerchantModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
