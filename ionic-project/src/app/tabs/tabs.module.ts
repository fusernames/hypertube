/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tabs.module.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 13:32:46 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/14 15:26:07 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs.router.module';

import { TabsPage } from './tabs.page';
import { MovieDetailPageModule } from '../page/movie-detail/movie-detail.module';
import { MoviePlayerPageModule } from '../page/movie-player/movie-player.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    MovieDetailPageModule,
    MoviePlayerPageModule,
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
