import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GithubService {
  private apiUrl = 'http://localhost:3000/api/'; // Point to your backend API

  constructor(private http: HttpClient) {}

  // Method to get organizations
  getOrganizations(): Observable<any> {
    return this.http.get(`${this.apiUrl}/organizations`).pipe(
      map((response) => {
        // You can transform the response if needed
        return response;
      }),
    );
  }

  // Method to get repos for an organization
  getRepos(org: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/organizations/${org}/repos`).pipe(
      map((response) => {
        // You can transform the response if needed
        return response;
      }),
    );
  }

  getAccessToken(accessToken: string): Observable<any> {
    return this.http.get(`${this.apiUrl}github/accessToken?code=`+accessToken, {
    });
  }

  // Method to connect to GitHub (OAuth authentication)
  connectToGitHub(): Observable<any> {
    return this.http.get(`${this.apiUrl}github/connect`);
  }

  removeIntegration (userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}github/remove`, {
      body: { userId: userId }
    });
  }

}
