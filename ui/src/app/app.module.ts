import { ClipboardModule } from '@angular/cdk/clipboard';
import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from '@components/app/app.component';
import { BannedComponent } from '@components/banned/banned.component';
import { ConfirmActionBottomSheetComponent } from '@components/bottom-sheets/confirm-action-bottom-sheet/confirm-action-bottom-sheet.component';
import { ChatComponent } from '@components/chat/chat.component';
import { CommentPreviewComponent } from '@components/comment-preview/comment-preview.component';
import { CommentComponent } from '@components/comment/comment.component';
import { CommentsFeedComponent } from '@components/comments-feed/comments-feed.component';
import { ConfirmActionDialogComponent } from '@components/dialogs/confirm-action-dialog/confirm-action-dialog.component';
import { CreateGroupDialogComponent } from '@components/dialogs/create-group-dialog/create-group-dialog.component';
import { ErrorDialogComponent } from '@components/dialogs/error-dialog/error-dialog.component';
import { ReportDialogComponent } from '@components/dialogs/report-dialog/report-dialog.component';
import { ReviewReportDialogComponent } from '@components/dialogs/review-report-dialog/review-report-dialog.component';
import { UserListDialogComponent } from '@components/dialogs/user-list-dialog/user-list-dialog.component';
import { FeedComponent } from '@components/feed/feed.component';
import { GroupAboutComponent } from '@components/group-about/group-about.component';
import { GroupHeaderComponent } from '@components/group-header/group-header.component';
import { GroupComponent } from '@components/group/group.component';
import { HomeComponent } from '@components/home/home.component';
import { ImdbComponent } from '@components/imdb/imdb.component';
import { InfoCommentComponent } from '@components/info-comment/info-comment.component';
import { InfoGroupComponent } from '@components/info-group/info-group.component';
import { InfoPostComponent } from '@components/info-post/info-post.component';
import { InfoUserComponent } from '@components/info-user/info-user.component';
import { LoginComponent } from '@components/login/login.component';
import { MediaPreviewComponent } from '@components/media-preview/media-preview.component';
import { MovieCreditComponent } from '@components/movie-credit/movie-credit.component';
import { MovieCreditsComponent } from '@components/movie-credits/movie-credits.component';
import { MovieHeaderComponent } from '@components/movie-header/movie-header.component';
import { MovieKeywordsComponent } from '@components/movie-keywords/movie-keywords.component';
import { MovieProductionCompanyComponent } from '@components/movie-production-company/movie-production-company.component';
import { MovieProductionInfoComponent } from '@components/movie-production-info/movie-production-info.component';
import { MovieProductionComponent } from '@components/movie-production/movie-production.component';
import { MovieRatingComponent } from '@components/movie-rating/movie-rating.component';
import { MovieThumbnailComponent } from '@components/movie-thumbnail/movie-thumbnail.component';
import { MovieComponent } from '@components/movie/movie.component';
import { MoviesPopularComponent } from '@components/movies-popular/movies-popular.component';
import { MoviesSearchComponent } from '@components/movies-search/movies-search.component';
import { MoviesTrendingComponent } from '@components/movies-trending/movies-trending.component';
import { MoviesComponent } from '@components/movies/movies.component';
import { MyGroupsComponent } from '@components/my-groups/my-groups.component';
import { NavigationComponent } from '@components/navigation/navigation.component';
import { NewCommentComponent } from '@components/new-comment/new-comment.component';
import { NewPostActionsComponent } from '@components/new-post-actions/new-post-actions.component';
import { NewPostComponent } from '@components/new-post/new-post.component';
import { NotificationsComponent } from '@components/notifications/notifications.component';
import { PageNotFoundComponent } from '@components/page-not-found/page-not-found.component';
import { PostPreviewComponent } from '@components/post-preview/post-preview.component';
import { PostComponent } from '@components/post/post.component';
import { RegisterComponent } from '@components/register/register.component';
import { ReportComponent } from '@components/report/report.component';
import { ReportsComponent } from '@components/reports/reports.component';
import { ScrollTopComponent } from '@components/scroll-top/scroll-top.component';
import { SearchComponent } from '@components/search/search.component';
import { SplashComponent } from '@components/splash/splash.component';
import { UserAboutComponent } from '@components/user-about/user-about.component';
import { UserHeaderComponent } from '@components/user-header/user-header.component';
import { UserRatingComponent } from '@components/user-rating/user-rating.component';
import { UserComponent } from '@components/user/user.component';
import { YoutubePreviewComponent } from '@components/youtube-preview/youtube-preview.component';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { MaterialModule } from '@modules/material/material.module';
import { ShortNumberPipe } from '@pipes/short-number.pipe';
import { AuthService } from '@services/auth.service';
import { appInitializer } from '@util/app-initializer';
import { ErrorInterceptor } from '@util/error.interceptor';
import { JwtInterceptor } from '@util/jwt.interceptor';
import { RatingModule } from 'ng-starrating';
import { ChartsModule } from 'ng2-charts';
import { CountUpModule } from 'ngx-countup';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AppRoutingModule } from './app-routing.module';
import { MovieDurationPipe } from './pipes/movie-duration.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { MovieService } from './services/movie.service';
import { SplashService } from './services/splash.service';

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
    MovieCreditsComponent,
    MovieRatingComponent,
    MovieCreditComponent,
    UserRatingComponent,
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
    CountUpModule,
    RatingModule,
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
