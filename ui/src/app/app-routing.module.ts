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
import { AuthGuard } from '@util/auth.guard';
import { BannedComponent } from './components/banned/banned.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: 'feed', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'explore', component: FeedComponent, canActivate: [AuthGuard] },
  { path: 'posts/:id', component: PostPreviewComponent, canActivate: [AuthGuard] },
  { path: 'comments/:id', component: CommentPreviewComponent, canActivate: [AuthGuard] },
  { path: 'users/:id', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'groups/:id', component: GroupComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'notifications', component: NotificationsComponent, canActivate: [AuthGuard] },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard] },
  { path: 'groups', component: MyGroupsComponent, canActivate: [AuthGuard] },
  { path: 'reports', component: ReportsComponent, canActivate: [AuthGuard] },
  { path: 'not-found', component: PageNotFoundComponent, canActivate: [AuthGuard] },
  { path: 'banned', component: BannedComponent, canActivate: [] },
  { path: '', component: HomeComponent },
  { path: '**', component: PageNotFoundComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
