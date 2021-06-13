import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from '@components/app/app.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { LoginComponent } from '@components/login/login.component';
import { RegisterComponent } from '@components/register/register.component';
import { HomeComponent } from '@components/home/home.component';
import { ChatComponent } from '@components/chat/chat.component';
import { MaterialModule } from '@modules/material/material.module';
import { FeedComponent } from '@components/feed/feed.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ShortNumberPipe } from '@pipes/short-number.pipe';
import { PostComponent } from '@components/post/post.component';
import { CommentComponent } from '@components/comment/comment.component';
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
import { CommentsFeedComponent } from './components/comments-feed/comments-feed.component';
import { SearchComponent } from './components/search/search.component';
import { InfoUserComponent } from './components/info-user/info-user.component';
import { InfoGroupComponent } from './components/info-group/info-group.component';
import { InfoPostComponent } from './components/info-post/info-post.component';
import { InfoCommentComponent } from './components/info-comment/info-comment.component';
import { MyGroupsComponent } from './components/my-groups/my-groups.component';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { CommentPreviewComponent } from './components/comment-preview/comment-preview.component';
import { CreateGroupDialogComponent } from './components/dialogs/create-group-dialog/create-group-dialog.component';
import { GroupComponent } from './components/group/group.component';
import { GroupHeaderComponent } from './components/group-header/group-header.component';
import { GroupAboutComponent } from './components/group-about/group-about.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from '@util/error.interceptor';
import { JwtInterceptor } from '@util/jwt.interceptor';
import { AuthService } from '@services/auth.service';
import { appInitializer } from '@util/app-initializer';
import { ErrorDialogComponent } from '@components/dialogs/error-dialog/error-dialog.component';
import { CommonModule } from '@angular/common';
import { ReportDialogComponent } from './components/dialogs/report-dialog/report-dialog.component';
import { SplashService } from './services/splash.service';
import { OverlayModule } from '@angular/cdk/overlay';
import { SplashComponent } from './components/splash/splash.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ChartsModule } from 'ng2-charts';
import { ReportComponent } from './components/report/report.component';
import { ReviewReportDialogComponent } from './components/dialogs/review-report-dialog/review-report-dialog.component';
import { BannedComponent } from './components/banned/banned.component';
import { MoviesComponent } from './components/movies/movies.component';
import { MovieComponent } from './components/movie/movie.component';
import { MovieThumbnailComponent } from './components/movie-thumbnail/movie-thumbnail.component';
import { MovieService } from './services/movie.service';
import { MoviesPopularComponent } from './components/movies-popular/movies-popular.component';
import { MoviesTrendingComponent } from './components/movies-trending/movies-trending.component';
import { MoviesSearchComponent } from './components/movies-search/movies-search.component';
import { MovieDurationPipe } from './pipes/movie-duration.pipe';
import { ImdbComponent } from './components/imdb/imdb.component';
import { MovieHeaderComponent } from './components/movie-header/movie-header.component';
import { MovieProductionComponent } from './components/movie-production/movie-production.component';
import { MovieProductionCompanyComponent } from './components/movie-production-company/movie-production-company.component';
import { MovieProductionInfoComponent } from './components/movie-production-info/movie-production-info.component';
import { MovieKeywordsComponent } from './components/movie-keywords/movie-keywords.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ChatComponent,
    FeedComponent,
    ShortNumberPipe,
    PostComponent,
    CommentComponent,
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
    CommentsFeedComponent,
    SearchComponent,
    InfoUserComponent,
    InfoGroupComponent,
    InfoPostComponent,
    InfoCommentComponent,
    MyGroupsComponent,
    ScrollTopComponent,
    CommentPreviewComponent,
    CreateGroupDialogComponent,
    GroupComponent,
    GroupHeaderComponent,
    GroupAboutComponent,
    ErrorDialogComponent,
    ReportDialogComponent,
    SplashComponent,
    ReportsComponent,
    ReportComponent,
    ReviewReportDialogComponent,
    BannedComponent,
    MoviesComponent,
    MovieComponent,
    MovieThumbnailComponent,
    MoviesPopularComponent,
    MoviesTrendingComponent,
    MoviesSearchComponent,
    MovieDurationPipe,
    ImdbComponent,
    MovieHeaderComponent,
    MovieProductionComponent,
    MovieProductionCompanyComponent,
    MovieProductionInfoComponent,
    MovieKeywordsComponent,
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
    HttpClientModule,
    CommonModule,
    FormsModule,
    OverlayModule,
    ChartsModule,
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthService, MovieService, SplashService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ShortNumberPipe,
    MovieDurationPipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
