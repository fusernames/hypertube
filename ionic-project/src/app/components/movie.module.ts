/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   movie.module.ts                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/14 15:10:33 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/14 15:16:23 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { MovieItemComponent } from './movie-item/movie-item.component';

@NgModule({
    imports: [
        IonicModule,
        CommonModule
    ],
    declarations: [MovieItemComponent],
    exports: [MovieItemComponent]
})
export class MovieModule {}
