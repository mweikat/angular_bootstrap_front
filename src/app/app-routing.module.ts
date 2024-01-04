import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogoutComponent } from '@modules/admin/components/logout/logout.component';

const routes: Routes = [
  {path:'auth',loadChildren:() => import('./modules/auth/auth.module').then(m=>m.AuthModule)},
  {path:'admin',loadChildren:() => import('./modules/admin/admin.module').then(m=>m.AdminModule)},
  {path:'logout',component:LogoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
