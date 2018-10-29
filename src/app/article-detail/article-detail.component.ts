import { Component, OnInit, Input } from '@angular/core';
import { Article } from './../article';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from './../article.service';
import { Location } from '@angular/common';
import { AuthenticationService } from './../authentication.service';

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.css']
})
export class ArticleDetailComponent implements OnInit {

  @Input() article: Article;
  private included = null;
  public editmode = false;
  public selectedFile = null;
  public previewSrc = null;
  public newImageId = null;
  public activeButton = true;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private authenticationService: AuthenticationService,
    private location: Location,
    ) { }

  ngOnInit() {
    this.getArticle();
  }

  getArticle(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.articleService.getArticle(id)
      .subscribe(article => {
        this.article = article.data.attributes;
        this.included = article.included[0].attributes;
        this.included.url = 'http://labo5.local' + this.included.url;
        console.log(article);
        this.authenticationService.refresh();
      });
  }

  goBack(): void {
    this.location.back();
  }
  login(): void {
    this.authenticationService.login({
      username: 'root',
      password: 'secret',
    });
  }
  refresh(): void {
    this.authenticationService.refresh();
  }
  onNewImage(event) {
    this.selectedFile = <File>event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.previewSrc = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }
  delete() {
    if (confirm('bent u zeker?')) {
      console.log('deleting');
      this.articleService.deleteArticle(this.article.uuid)
        .subscribe(response => { console.log(response); this.location.back(); }
        );
    }
  }
  upload() {
    this.activeButton = false;
    this.articleService.uploadImage(this.selectedFile).subscribe(response => {
      this.newImageId = response.uuid[0].value;
      this.included.url = 'http://labo5.local' + response.url[0].value;
      this.activeButton = true;
      this.authenticationService.refresh();
    });
  }
  edit(): void {
    if (this.editmode) {
      // update article
      this.articleService.updateArticle({
          data: {
            type: 'node--article',
            id: this.article.uuid,
            attributes: {
              body: {
                value: this.article.body.value,
              },
              title: this.article.title,
            },
            relationships: {
              field_image: {
                data: {
                  id: (this.newImageId) ? this.newImageId : this.included.uuid,
                  type: 'file--file',
                }
              }
            }
          }
      }).subscribe(response => this.authenticationService.refresh());
    }
    this.editmode = !this.editmode;
  }
}
