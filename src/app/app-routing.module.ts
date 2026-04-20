import {  NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroBannerComponent } from './components/hero-banner/hero-banner.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PortalComponent } from './components/portal/portal.component';
import { authGuard } from './guards/auth.guard';
import { QuizComponent } from './components/portal/quiz/quiz.component';
const routes: Routes = [
  {
    path:'',component:HeroBannerComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'portal',
    component: PortalComponent,
    canActivate: [authGuard]
  },
  {
    path: 'portal/quiz/:sectionId/:topicSlug',
    component: QuizComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
