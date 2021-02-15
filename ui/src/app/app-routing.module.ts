import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from '@components/chat/chat.component';
import { CommentPreviewComponent } from '@components/comment-preview/comment-preview.component';
import { FeedComponent } from '@components/feed/feed.component';
import { GroupComponent } from '@components/group/group.component';
import { HomeComponent } from '@components/home/home.component';
import { MyGroupsComponent } from '@components/my-groups/my-groups.component';
import { NotificationsComponent } from '@components/notifications/notifications.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { PostPreviewComponent } from '@components/post-preview/post-preview.component';
import { SearchComponent } from '@components/search/search.component';
import { UserComponent } from '@components/user/user.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'explore', component: FeedComponent },
  { path: 'posts/:id', component: PostPreviewComponent },
  { path: 'comments/:id', component: CommentPreviewComponent },
  { path: 'users/:id', component: UserComponent },
  { path: 'groups/:id', component: GroupComponent },
  { path: 'chat', component: ChatComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'search', component: SearchComponent },
  { path: 'groups', component: MyGroupsComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
