import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/form-send' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.module').then(m => m.WelcomeModule)},
  { path: 'form-send', loadChildren: () => import('./form-send/form-send.module').then(m => m.FormSendModule)},
  { path: 'message', loadChildren: () => import('./message/message.module').then(m => m.MessageModule)},
  { path: 'bittrex', loadChildren: () => import('./bittrex/bittrex.module').then(m => m.BittrexModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
