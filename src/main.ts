import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';
const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // Preserve existing providers
    provideAnimations(), // Add animations provider
    provideNoopAnimations(),
  ],
};

bootstrapApplication(AppComponent, updatedAppConfig)
  .catch((err) => console.error(err));
