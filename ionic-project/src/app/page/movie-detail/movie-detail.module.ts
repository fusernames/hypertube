/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movie-detail.module.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 23:12:17 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/11 13:22:54 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MovieDetailPage } from './movie-detail.page';
import { TorrentStatusComponent } from 'src/app/components/torrent-status/torrent-status.component';

const routes: Routes = [
  {
    path: '',
    component: MovieDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MovieDetailPage,
    TorrentStatusComponent
  ]
})
export class MovieDetailPageModule {}
