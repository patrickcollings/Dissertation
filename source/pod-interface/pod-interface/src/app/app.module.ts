import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { JwtModule } from '@auth0/angular-jwt';

import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent},
  { path: 'auth', component: AuthorizeComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: ''}
];


// SERVICES
import { AuthorizeService } from './services/authorize.service';
import { PodService } from './services/pod.service';

import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AuthorizedAppsComponent } from './components/authorized-apps/authorized-apps.component';
import { RequestsComponent } from './components/requests/requests.component';
import { SettingsComponent } from './components/settings/settings.component';
import { DataComponent } from './components/data/data.component';
import { AuthorizeComponent } from './components/authorize/authorize.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AuthorizedAppsComponent,
    RequestsComponent,
    SettingsComponent,
    DataComponent,
    AuthorizeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['localhost:4000/api/auth']
      }
    }),
    RouterModule.forRoot(routes)
  ],
  providers: [
    AuthorizeService,
    PodService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
