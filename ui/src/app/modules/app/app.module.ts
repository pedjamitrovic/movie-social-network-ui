import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '@components/app/app.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { HomeComponent } from '@components/home/home.component';
import { ChatComponent } from '@components/chat/chat.component';
import { GroupMessagesPipe } from '@pipes/group-messages/group-messages.pipe';
import { MaterialModule } from '@modules/material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ChatComponent,
    GroupMessagesPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
