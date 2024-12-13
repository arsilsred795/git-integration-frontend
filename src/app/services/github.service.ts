import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  fetchData(): Observable<any> {
    return this.http.get(`${this.apiUrl}github/fetch-data`);
  }

  removeIntegration (userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}github/remove`, {
      body: { userId: userId }
    });
  }

  fetchOrganizations(accessToken: string): Observable<any> {
    const headers = new HttpHeaders({
      accesstoken: accessToken,
    });
    return this.http.get(`${this.apiUrl}github/organizations`, { headers });
  }

  fetchRepos(accessToken: string, orgName: string): Observable<any> {
    const headers = new HttpHeaders({
      accesstoken: accessToken,
    });
    return this.http.get(`${this.apiUrl}github/organizations/repos?org=`+orgName, { headers });
  }
  fetchCommits(accessToken: string, repo: string, owner: string): Observable<any> {
    const headers = new HttpHeaders({
      accesstoken: accessToken,
      repo: repo,
      owner: owner

    });
    return this.http.get(`${this.apiUrl}github/organizations/repos/commits`, { headers });
  }
  fetchPulls(accessToken: string, repo: string, owner: string): Observable<any> {
    const headers = new HttpHeaders({
      accesstoken: accessToken,
      repo: repo,
      owner: owner

    });
    return this.http.get(`${this.apiUrl}github/organizations/repos/pulls`, { headers });
  }
  fetchIssues(accessToken: string, repo: string, owner: string): Observable<any> {
    const headers = new HttpHeaders({
      accesstoken: accessToken,
      repo: repo,
      owner: owner

    });
    return this.http.get(`${this.apiUrl}github/organizations/repos/issues`, { headers });
  }
  fetchChangelogs(accessToken: string, repo: string, owner: string): Observable<any> {
    const headers = new HttpHeaders({
      accesstoken: accessToken,
      repo: repo,
      owner: owner

    });
    return this.http.get(`${this.apiUrl}github/organizations/repos/issues/changelogs`, { headers });
  }

  fetchUsers(accessToken: string, org: string): Observable<any> {
    const headers = new HttpHeaders({
      accesstoken: accessToken,
      org: org,

    });
    return this.http.get(`${this.apiUrl}github/organizations/users`, { headers });
  }
}
