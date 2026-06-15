import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AloginComponent } from './alogin/alogin.component';
import { RegisterComponent } from './register/register.component';


@NgModule({
  declarations: [
    AloginComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
