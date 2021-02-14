import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '@components/app/app.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { HomeComponent } from '@components/home/home.component';
import { ChatComponent } from '@components/chat/chat.component';
import { GroupMessagesPipe } from '@pipes/group-messages/group-messages.pipe';
import { MaterialModule } from '@modules/material/material.module';
import { FeedComponent } from '@components/feed/feed.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PostActionsComponent } from '@components/post-actions/post-actions.component';
import { ShortNumberPipe } from '@pipes/short-number.pipe';
import { PostComponent } from '@components/post/post.component';
import { CommentComponent } from '@components/comment/comment.component';
import { CommentActionsComponent } from '@components/comment-actions/comment-actions.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { PostPreviewComponent } from '@components/post-preview/post-preview.component';
import { UserComponent } from '@components/user/user.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { NewPostActionsComponent } from './components/new-post-actions/new-post-actions.component';
import { MediaPreviewComponent } from './components/media-preview/media-preview.component';
import { YoutubePreviewComponent } from './components/youtube-preview/youtube-preview.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { UserAboutComponent } from './components/user-about/user-about.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { ConfirmActionDialogComponent } from './components/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { UserListDialogComponent } from './components/dialogs/user-list-dialog/user-list-dialog.component';
import { ConfirmActionBottomSheetComponent } from './components/bottom-sheets/confirm-action-bottom-sheet/confirm-action-bottom-sheet.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { NewCommentComponent } from './components/new-comment/new-comment.component';
import { UserCommentsComponent } from './components/user-comments/user-comments.component';
import { SearchComponent } from './components/search/search.component';
import { InfoUserComponent } from './components/info-user/info-user.component';
import { InfoGroupComponent } from './components/info-group/info-group.component';
import { InfoPostComponent } from './components/info-post/info-post.component';
import { InfoCommentComponent } from './components/info-comment/info-comment.component';
import { MyGroupsComponent } from './components/my-groups/my-groups.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { CommentPreviewComponent } from './components/comment-preview/comment-preview.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ChatComponent,
    GroupMessagesPipe,
    FeedComponent,
    PostActionsComponent,
    ShortNumberPipe,
    PostComponent,
    CommentComponent,
    CommentActionsComponent,
    PageNotFoundComponent,
    PostPreviewComponent,
    UserComponent,
    NewPostComponent,
    NewPostActionsComponent,
    MediaPreviewComponent,
    YoutubePreviewComponent,
    SafeUrlPipe,
    UserHeaderComponent,
    UserAboutComponent,
    ConfirmActionDialogComponent,
    UserListDialogComponent,
    ConfirmActionBottomSheetComponent,
    NotificationsComponent,
    NewCommentComponent,
    UserCommentsComponent,
    SearchComponent,
    InfoUserComponent,
    InfoGroupComponent,
    InfoPostComponent,
    InfoCommentComponent,
    MyGroupsComponent,
    ScrollTopComponent,
    CommentPreviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    ClipboardModule,
    PickerModule,
  ],
  providers: [ShortNumberPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
