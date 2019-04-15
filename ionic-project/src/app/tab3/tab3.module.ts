/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tab3.module.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/14 14:39:27 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/14 15:12:48 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { MovieModule } from '../components/movie.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    MovieModule
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule {}
