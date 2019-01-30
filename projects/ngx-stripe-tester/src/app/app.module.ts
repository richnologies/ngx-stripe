import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgxStripeModule } from 'ngx-stripe';

import { AppComponent } from './app.component';
import { DefaultComponent } from './default.component';

const ROUTES = [
  {
    path: 'test-01',
    loadChildren: './stripe-test-01/stripe-test-01.module#StripeTest01Module'
  },
  {
    path: '',
    component: DefaultComponent
  }
];

@NgModule({
  declarations: [AppComponent, DefaultComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    NgxStripeModule.forRoot('pk_test_nDR7IWEIGLp4a1SBtqKH5eyg')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
