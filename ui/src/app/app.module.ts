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
import { PostPreviewComponent } from './components/post-preview/post-preview.component';

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
  ],
  providers: [ShortNumberPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
