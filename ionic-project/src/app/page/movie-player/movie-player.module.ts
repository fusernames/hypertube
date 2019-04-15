/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movie-player.module.ts                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/12 12:47:09 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/12 12:47:10 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MoviePlayerPage } from './movie-player.page';
import { MovieMessageComponent } from 'src/app/components/movie-message/movie-message.component';

const routes: Routes = [
  {
    path: '',
    component: MoviePlayerPage
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
    MoviePlayerPage,
    MovieMessageComponent
  ]
})
export class MoviePlayerPageModule {}
