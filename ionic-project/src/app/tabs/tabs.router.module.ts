/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tabs.router.module.ts                              :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 13:28:52 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/14 14:56:20 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';
import { AppGuardGuard } from '../guard/app-guard.guard';
import { MovieDetailPage } from '../page/movie-detail/movie-detail.page';
import { MoviePlayerPage } from '../page/movie-player/movie-player.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    canActivate: [AppGuardGuard],
    children: [
      {
        canActivate: [AppGuardGuard],
        path: 'tab1',
        children: [
          {
            path: '',
            loadChildren: '../tab1/tab1.module#Tab1PageModule'
          },
          {
            canActivate: [AppGuardGuard],
            path: 'movie-details',
            component: MovieDetailPage
          },
          {
            canActivate: [AppGuardGuard],
            path: 'movie-player/:movieId',
            component: MoviePlayerPage
          }
        ]
      },
      {
        canActivate: [AppGuardGuard],
        path: 'tab2',
        children: [
          {
            path: '',
            loadChildren: '../tab2/tab2.module#Tab2PageModule'
          }
        ]
      },
      {
        canActivate: [AppGuardGuard],
        path: 'tab3',
        children: [
          {
            path: '',
            loadChildren: '../tab3/tab3.module#Tab3PageModule'
          }
        ]
      },
      {
        canActivate: [AppGuardGuard],
        path: 'tab4',
        children: [
          {
            path: '',
            loadChildren: '../tabs4/tabs4.module#Tabs4PageModule'
          }
        ]
      },
      {
        canActivate: [AppGuardGuard],
        path: '',
        redirectTo: '/tabs/tab1',
        pathMatch: 'full'
      }
    ]
  },
  {
    canActivate: [AppGuardGuard],
    path: '',
    redirectTo: '/tabs/tab1',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
