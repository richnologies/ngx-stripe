import { InjectionToken } from '@angular/core';

export interface NgStrEnvironment {
  production: boolean;
  measuramentid: string;
}

export const ENV = new InjectionToken<NgStrEnvironment>('[global] Environment');
