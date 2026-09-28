import { bootstrapApplication } from '@angular/platform-browser';
import { provideNgxStripe } from 'ngx-stripe';

import { AppComponent } from './app/app.component';

// Lane __LANE_ID__ — CDN train __CDN_NAME__ (informational; ngx-stripe loads the matching script).
bootstrapApplication(AppComponent, {
  providers: [provideNgxStripe('pk_test_REPLACE')]
}).catch((err) => console.error(err));
