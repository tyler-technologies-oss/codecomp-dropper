import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { AppRootRoutingModule } from './app-root-routing.module';
import { AppRootComponent } from './app-root/app-root.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppNavigationComponent } from './app-navigation/app-navigation.component';

@NgModule({
  declarations: [
    AppRootComponent,
    AppNavigationComponent
  ],
  imports: [
    BrowserModule,
    AppRootRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
  ],
  providers: [],
  bootstrap: [AppRootComponent]
})
export class AppRootModule { }
