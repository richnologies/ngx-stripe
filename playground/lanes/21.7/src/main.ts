import { bootstrapApplication } from '@angular/platform-browser';
import { provideNgxStripe } from 'ngx-stripe';

import { AppComponent } from './app/app.component';

// Lane 21.7 — CDN train basil (informational; ngx-stripe loads the matching script).
bootstrapApplication(AppComponent, {
  providers: [provideNgxStripe('pk_test_51Ii5RpH2XTJohkGafOSn3aoFFDjfCE4G9jmW48Byd8OS0u2707YHusT5PojHOwWAys9HbvNylw7qDk0KkMZomdG600TJYNYj20')]
}).catch((err) => console.error(err));
