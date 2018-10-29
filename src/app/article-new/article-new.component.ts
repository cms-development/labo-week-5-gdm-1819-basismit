import { Component, OnInit } from '@angular/core';
import { Article } from './../article';
import { ArticleService } from './../article.service';
import { AuthenticationService } from './../authentication.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-new',
  templateUrl: './article-new.component.html',
  styleUrls: ['./article-new.component.css']
})
export class ArticleNewComponent implements OnInit {
  article = {
    title: null,
    body: null,
  };
  selectedFile = null;
  previewSrc = null;
  activeButton = true;
  newImageId = null;

  constructor(
    private articleService: ArticleService,
    private authenticationService: AuthenticationService,
    private location: Location,
    private router: Router,
    ) { }

  ngOnInit() {
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
  upload() {
    this.activeButton = false;
    this.articleService.uploadImage(this.selectedFile).subscribe(response => {
      this.newImageId = response.uuid[0].value;
      this.activeButton = true;
      this.authenticationService.refresh();
    });
  }
  post() {
    this.articleService.postArticle({
      data: {
        type: 'node--article',
        attributes: {
          body: {
            value: this.article.body,
          },
          title: this.article.title,
        },
        relationships: {
          field_image: {
            data: {
              id: this.newImageId,
              type: 'file--file',
            }
          }
        }
      }
  }).subscribe(response => {
    console.log(response);
    // this.router.navigate(['articles']);

  });

  }

}
