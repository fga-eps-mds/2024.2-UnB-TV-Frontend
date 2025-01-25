// Import
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { SocialLoginModule, SocialAuthServiceConfig, GoogleLoginProvider, FacebookLoginProvider } from '@abacritt/angularx-social-login';

// Declaration
import {CommonModule} from '@angular/common';
import { NgModule, isDevMode } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VideoComponent } from './pages/video/video.component';
import { VideoViewerComponent } from './pages/video-viewer/video-viewer.component';
import { BackgroundComponent } from './components/background/background.component';
import { LoginSocialComponent } from './pages/login-social/login-social.component';
import { ActiveAccountComponent } from './pages/active-account/active-account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UserTokenInterceptor } from './interceptor/user-token-interceptor.service';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { CheckCodeRestPasswordComponent } from './pages/check-code-rest-password/check-code-rest-password.component';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './services/auth.service';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { StreamViewComponent } from './pages/stream-view/stream-view.component';
import { UpdateRoleComponent } from './pages/update-role/update-role.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MenuModule } from 'primeng/menu';
import { VideoCommentComponent } from './components/video-comment/video-comment.component';
import { SuggestAgendaComponent } from './pages/suggest-agenda/suggest-agenda.component';
import { ParticipateComponent } from './pages/participate/participate.component';
import { GridComponent } from './pages/grid/grid.component';
import { GridDaysComponent } from './pages/grid-days/grid-days.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { NgxGoogleAnalyticsModule, NgxGoogleAnalyticsRouterModule } from 'ngx-google-analytics';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgChartsModule } from 'ng2-charts';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';

import { CategoryTableComponent } from './pages/category-table/category-table.component';
import { VideoViewsComponent } from './pages/video-views/video-views.component';
import { DashboardCategoryComponent } from './pages/dashboard-category/dashboard-category.component';
import { RecordComponent } from './pages/record/record.component';
import { RecommendationVideosComponent } from './pages/recommendation-videos/recommendation-videos.component';
import { YourUnBTVComponent } from './pages/your-unbtv/your-unbtv.component';
import { FavoriteVideosComponent } from './pages/favorite-videos/favorite-videos.component';
import { WatchLaterVideosComponent } from './pages/watchlater-videos/watchlater-videos.component';
import { ControleSuperAdminComponent } from './pages/controle-super-admin/controle-super-admin.component';

import { NotificationsComponent } from './pages/notifications/notifications.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    OAuthModule.forRoot(),
    InputTextModule,
    DropdownModule,
    ButtonModule,
    ProgressSpinnerModule,
    MenuModule,
    FormsModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    SocialLoginModule,
    RecaptchaModule, // Importa o RecaptchaModule
    RecaptchaFormsModule, // Opcional, caso use com formulários
    NgxGoogleAnalyticsModule.forRoot('G-XL7Z0L7VM8'),
    NgxGoogleAnalyticsRouterModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    NgChartsModule,
    CommonModule,
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LoginSocialComponent,
    VideoComponent,
    VideoViewerComponent,
    BackgroundComponent,
    ActiveAccountComponent,
    ProfileComponent,
    ResetPasswordComponent,
    CheckCodeRestPasswordComponent,
    EditUserComponent,
    StreamViewComponent,
    UpdateRoleComponent,
    SuggestAgendaComponent,
    ParticipateComponent,
    GridComponent,
    GridDaysComponent,
    VideoCommentComponent,
    CatalogComponent,
    PrivacyPolicyComponent,
    HomeAdminComponent,
    CategoryTableComponent,
    VideoViewsComponent,
    DashboardCategoryComponent,
    RecordComponent,
    RecommendationVideosComponent,
    YourUnBTVComponent,
    FavoriteVideosComponent,
    WatchLaterVideosComponent,
    NotificationsComponent,
    ControleSuperAdminComponent,
  ],

  providers: [
    { provide: 'authGuard', useClass: AuthGuard },
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UserTokenInterceptor,
      multi: true,
    },
    { provide: OAuthStorage, useValue: localStorage },
    MessageService,
    ConfirmationService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '254484469180-1imr4ds36p8rq4fe7udkja212tu0p7jl.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('2640880742734858')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }