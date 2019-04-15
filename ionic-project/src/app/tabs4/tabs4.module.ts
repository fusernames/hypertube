/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   tabs4.module.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/15 07:47:06 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 07:49:09 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Tabs4Page } from './tabs4.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([{path: '', component: Tabs4Page}])
  ],
  declarations: [Tabs4Page]
})
export class Tabs4PageModule {}
