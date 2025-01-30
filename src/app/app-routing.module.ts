import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginSocialComponent } from './pages/login-social/login-social.component';
import { VideoComponent } from './pages/video/video.component';
import { StreamViewComponent } from './pages/stream-view/stream-view.component';
import { VideoViewerComponent } from './pages/video-viewer/video-viewer.component';
import { ActiveAccountComponent } from './pages/active-account/active-account.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { CheckCodeRestPasswordComponent } from './pages/check-code-rest-password/check-code-rest-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthGuard } from './guard/auth.guard';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { UpdateRoleComponent } from './pages/update-role/update-role.component';
import { SuggestAgendaComponent } from './pages/suggest-agenda/suggest-agenda.component';
import { ParticipateComponent } from './pages/participate/participate.component';
import { GridDaysComponent } from './pages/grid-days/grid-days.component';
import { GridComponent } from './pages/grid/grid.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';
import { HomeAdminComponent } from './pages/home-admin/home-admin.component';
import { AdminActivateComponent } from './pages/admin-activate/admin-activate.component';
import { CategoryTableComponent } from './pages/category-table/category-table.component';
import { VideoViewsComponent } from './pages/video-views/video-views.component';
import { RecordComponent } from './pages/record/record.component';
import { DashboardCategoryComponent } from './pages/dashboard-category/dashboard-category.component';
import { ControleSuperAdminComponent } from './pages/controle-super-admin/controle-super-admin.component';
import { RecommendationVideosComponent } from './pages/recommendation-videos/recommendation-videos.component';
import { YourUnBTVComponent } from './pages/your-unbtv/your-unbtv.component';
import { FavoriteVideosComponent } from './pages/favorite-videos/favorite-videos.component';
import { WatchLaterVideosComponent } from './pages/watchlater-videos/watchlater-videos.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { SuperAdminActivateComponent } from './pages/super-admin-activate/super-admin-activate.component';
import { WithTokenGuard } from './guard/with-token.guard';
import { TokenAdminGuard } from './guard/admin.guard';
import { TokenSuperAdminGuard } from './guard/super-admin.guard';
import { FeedbackPageComponent } from './pages/feedback-page/feedback-page.component';


const routes: Routes = [
  { path: '', component: LoginComponent, canActivate: [WithTokenGuard] },
  { path: 'stream', component: StreamViewComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'videos', component: VideoComponent },
  { path: 'video/:idVideo', component: VideoViewerComponent },
  { path: 'login', component: LoginComponent, canActivate: [WithTokenGuard] },
  { path: 'feedback-page', 
    component: FeedbackPageComponent,
    canActivate: [AuthGuard],
   },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [WithTokenGuard],
  },
  {
    path: 'loginsocial',
    component: LoginSocialComponent,
    canActivate: [WithTokenGuard],
  },
  {
    path: 'sendCodeResetPassword',
    component: CheckCodeRestPasswordComponent,
    canActivate: [WithTokenGuard],
  },
  {
    path: 'changePassword',
    component: ResetPasswordComponent,
    canActivate: [WithTokenGuard],
  },
  {
    path: 'video/:idVideo',
    component: VideoViewerComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activeAccount',
    component: ActiveAccountComponent,
    canActivate: [WithTokenGuard],
  },
  {
    path: 'suggestAgenda',
    component: SuggestAgendaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'participate',
    component: ParticipateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'editUser/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard],
  },
  { path: 'grid-days', component: GridDaysComponent },
  { path: 'grid-days/:day', component: GridComponent },
  {
    path: 'update-role',
    component: UpdateRoleComponent,
    canActivate: [TokenSuperAdminGuard],
  },
  { path: 'privacy', component: PrivacyPolicyComponent },

  {
    path: 'homeAdmin',
    component: HomeAdminComponent,
    canActivate: [TokenAdminGuard],
  },
  {
    path: 'adminActivate',
    component: AdminActivateComponent,
  },
  {
    path: 'superAdminActivate',
    component: SuperAdminActivateComponent,
  },
  {
    path: 'category-views',
    component: CategoryTableComponent,
    canActivate: [TokenAdminGuard],
  },
  {
    path: 'video-views',
    component: VideoViewsComponent,
    canActivate: [TokenAdminGuard],
  },
  {
    path: 'dashboard',
    component: DashboardCategoryComponent,
    canActivate: [TokenAdminGuard],
  },
  {
    path: 'record',
    component: RecordComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'recommendation',
    component: RecommendationVideosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'sua-unbtv',
    component: YourUnBTVComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'favorites',
    component: FavoriteVideosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'watch-later',
    component: WatchLaterVideosComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'controleSuperAdmin',
    component: ControleSuperAdminComponent,
    canActivate: [TokenSuperAdminGuard],
  },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  
  exports: [RouterModule],
})
export class AppRoutingModule {}
