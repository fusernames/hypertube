/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   app-routing.module.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 13:23:11 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 10:44:47 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AppGuardGuard } from './guard/app-guard.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AppGuardGuard],
    loadChildren: './tabs/tabs.module#TabsPageModule'
  },
  {
    path: 'login',
    loadChildren: './page/account/login/login.module#LoginPageModule'
  },
  {
    path: 'signup',
    loadChildren: './page/account/signup/signup.module#SignupPageModule'
  },
  { path: 'profile', loadChildren: './page/account/profile/profile.module#ProfilePageModule' },
  { path: 'security', loadChildren: './page/account/security/security.module#SecurityPageModule' }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
