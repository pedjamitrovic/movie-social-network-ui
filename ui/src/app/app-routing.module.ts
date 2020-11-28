import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from '@components/chat/chat.component';
import { FeedComponent } from '@components/feed/feed.component';
import { HomeComponent } from '@components/home/home.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { PostPreviewComponent } from '@components/post-preview/post-preview.component';
import { UserComponent } from '@components/user/user.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'posts/:id', component: PostPreviewComponent },
  { path: 'users/:id', component: UserComponent },
  { path: 'chat', component: ChatComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
