import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { RequestComponent } from './components/request/request.component';
import { CallbackComponent } from './components/callback/callback.component';

const routes: Routes = [
  {path: 'request', component: RequestComponent },
  {path: 'callback', component: CallbackComponent },
  {path: '**', redirectTo: 'request' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
