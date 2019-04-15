/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Movie.ts                                           :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 18:44:34 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/10 18:44:36 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Torrent } from './Torrent';

export class Movie {
    constructor(public id: number,
                public image: string,
                public uploadedAt: string,
                public description: string,
                public genre: string[],
                public lang: string,
                public rating: number,
                public year: number,
                public torrent: Torrent[],
                public trailer: string,
                public title: string) {}
}
