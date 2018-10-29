import { Injectable } from '@angular/core';
import { Article } from './article';
import { ARTICLES } from './mock-articles';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(
    private http: HttpClient,
  ) { }
  private base = 'http://labo5.local';
  private baseUrl = this.base + '/jsonapi/node/article';

  getArticles(): Observable <Article[]> {
    // return of (ARTICLES);
     return this.http.get<Article[]>(this.baseUrl);
  }
  getArticle(id: string): Observable<Article> {
    // return of (ARTICLES.find(article => article.id === id));
    return this.http.get<Article>(`${this.baseUrl}/${id}?include=field_image`);
  }
  postArticle(data: object): Observable<Response> {
    return this.http.post<Response>(this.baseUrl, data, {
      headers: new HttpHeaders(
        {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
          'csrf_token': localStorage.getItem('csrf_token'),
        }
      )
    });
  }
  updateArticle(data: object): Observable<Response> {
    return this.http.patch<Response>(`${this.baseUrl}/${data.data.id}`, data, {
      headers: new HttpHeaders(
        {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/vnd.api+json',
          'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
          'csrf_token': localStorage.getItem('csrf_token'),
        }
      )
    });
  }
  uploadImage(file): Observable<Response> {
    return this.http.post<Response>(`${this.base}/file/upload/node/article/field_image?_format=json`, file, {
      headers: new HttpHeaders(
        {
          'Accept': 'application/vnd.api+json',
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `file; filename="${file.name}"`,
          'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
          'csrf_token': localStorage.getItem('csrf_token'),
        }),
      });
  }
  deleteArticle(id: string): Observable<Response> {
    return this.http.delete<Response>(`${this.baseUrl}/${id}`, {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        'Authorization': 'Bearer ' + localStorage.getItem('access_token'),
        'csrf_token': localStorage.getItem('csrf_token'),
    }
    });
  }
}
