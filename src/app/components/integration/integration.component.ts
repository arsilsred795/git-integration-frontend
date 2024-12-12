import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL_IMPORTS } from '../../material.config';
import { ActivatedRoute, Router } from '@angular/router';
import { GithubService } from '../../services/github.service';
import { json } from 'node:stream/consumers';


@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss'],
  standalone: true,
  imports: [...MATERIAL_IMPORTS,CommonModule],
})
export class IntegrationComponent implements OnInit {
  integrationStatus: any;
  userInfo: any;
  constructor(private router: Router,private githubService: GithubService) {}

  ngOnInit() {
    // Retrieve the state passed via navigation
    this.userInfo = JSON.parse(localStorage.getItem("userInfo") ?? '{}');
    console.log("user info",this.userInfo)
    debugger
    if(JSON.stringify(this.userInfo) === '{}'){
      this.redirectToHome()
    }
  }
  removeIntegration(){
    this.githubService.removeIntegration(this.userInfo.userId).subscribe(res => {
      if(res)
      {
        this.redirectToHome()
      }
    })
  }
  redirectToHome(){
    localStorage.removeItem("userInfo")
    this.router.navigate(['']);
  }
  viewDetail(){
    this.router.navigate(['/github-data']);
  }
}
