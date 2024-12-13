import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
import { enableProdMode } from '@angular/core';
const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Preserve existing providers
    provideAnimations(), // Add animations provider
    provideNoopAnimations(),
  ],
};
if ((window as any).ENABLE_PROD_MODE) {
  enableProdMode();
}
bootstrapApplication(AppComponent, updatedAppConfig)
  .catch((err) => console.error(err));
