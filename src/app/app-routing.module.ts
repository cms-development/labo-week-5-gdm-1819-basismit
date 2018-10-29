import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ArticlesComponent } from './articles/articles.component';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleNewComponent } from './article-new/article-new.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path: 'articles', component: ArticlesComponent },
  { path: '', redirectTo: '/articles', pathMatch: 'full' },
  { path: 'articles/new', component: ArticleNewComponent },
  { path: 'articles/:id', component: ArticleDetailComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [
RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ]
})


export class AppRoutingModule { }
