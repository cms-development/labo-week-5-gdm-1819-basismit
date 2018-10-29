import { Component, OnInit } from '@angular/core';
import { Article } from './../article';
import { ARTICLES } from './../mock-articles';
import { ArticleService } from './../article.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {
  articles: Article[];

  constructor(private articleService: ArticleService) { }

  getArticles(): void {
    // this.articles = this.articleService.getArticles();
    this.articleService.getArticles()
      .subscribe(articles => {
        this.articles = articles.data;
      });
  }

  ngOnInit() {
    this.getArticles();
  }

}
