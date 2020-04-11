import { NgModule } from '@angular/core';
import { WelcomeRoutingModule } from './welcome-routing.module';
import { NgZorroAntdModule, NZ_I18N, NZ_ICONS, en_US, NzInputModule, NzFormModule, NzButtonModule } from 'ng-zorro-antd';
import { WelcomeComponent } from './welcome.component';
import { IconDefinition } from '@ant-design/icons-angular';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CommonModule } from '@angular/common';
import { QrCodeModule } from 'ng-qrcode';

const antDesignIcons = AllIcons as {
  [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key])

@NgModule({
  imports: [
    WelcomeRoutingModule, 
    ReactiveFormsModule, 
    FormsModule,  
    CommonModule, 
    NgZorroAntdModule,
    NzInputModule,
    NzFormModule,
    NzButtonModule, 
    NzTableModule,
    QrCodeModule],
  declarations: [WelcomeComponent],
  exports: [WelcomeComponent],
  providers: [{ provide: NZ_I18N, useValue: en_US }, { provide: NZ_ICONS, useValue: icons }]
})
export class WelcomeModule { }
