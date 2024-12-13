import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.config';
import { GithubService } from '../../services/github.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...MATERIAL_IMPORTS, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  integrationStatus: any;
  accessToken: any;
  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private githubService: GithubService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let userInfo = localStorage.getItem('userInfo');
    this.route.queryParams.subscribe((params) => {
      this.accessToken = params['code'];
      if (isPlatformBrowser(this.platformId)) {
        if (this.accessToken && !userInfo) {
          this.githubService
            .getAccessToken(this.accessToken)
            .subscribe((response) => {
              if (response) {
                this.integrationStatus = response;
                localStorage.setItem(
                  'userInfo',
                  JSON.stringify(response.integration)
                );
                this.router.navigate(['/integration-status']);
              }
            });
        }
      }
    });
    if (userInfo) {
      this.router.navigate(['/integration-status']);
    }
  }
  connectToGitHub() {
    this.githubService.connectToGitHub().subscribe((callbackURL) => {
      if (callbackURL) {
        window.location.href = callbackURL;
      }
    });
  }
}
