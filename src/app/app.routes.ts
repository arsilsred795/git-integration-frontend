import { provideRouter, withEnabledBlockingInitialNavigation } from '@angular/router';
import { IntegrationComponent } from './components/integration/integration.component';
import { GithubDataComponent } from './components/github-data/github-data.component';
import { HomeComponent } from './components/home/home.component';

export const routes = [
  { path: '', component: HomeComponent },
  { path: 'integration-status', component: IntegrationComponent },
  { path: 'github-data', component: GithubDataComponent },
];

export const appConfig = [
  provideRouter(routes, withEnabledBlockingInitialNavigation()),
];
