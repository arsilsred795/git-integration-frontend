import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MATERIAL_IMPORTS } from '../../material.config';
import { GithubService } from '../../services/github.service';
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [...MATERIAL_IMPORTS,CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent{
  integrationStatus: any;
  accessToken: any;
  constructor(@Inject(PLATFORM_ID) private platformId: any,private githubService: GithubService, private router: Router, private route: ActivatedRoute){
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.accessToken = params['code'];
      if (isPlatformBrowser(this.platformId)) {
      let userInfo = localStorage.getItem("userInfo")
      if (this.accessToken && !userInfo) {
          this.githubService.getAccessToken(this.accessToken).subscribe(response => {
            if (response) {
              debugger
              console.log("res",response)
              this.integrationStatus = response;
              localStorage.setItem("userInfo",JSON.stringify(response.integration))
              this.router.navigate(['/integration-status']);
            }
          });
      }
    }
    });
  }
  connectToGitHub() {
    this.githubService.connectToGitHub().subscribe(res => {
      if(res){
        window.open(res)
      }
    });
  }
}


