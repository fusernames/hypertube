/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tab1.module.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 15:09:34 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/14 15:14:15 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { MovieModule } from '../components/movie.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]),
    MovieModule
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
