/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Api.ts                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 10:54:08 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 02:11:26 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Movie } from './Movie';
import { Movies } from './Movies';
import { Torrent } from './Torrent';

export abstract class Api {
    name: string;
    url: string;
    value: string;

    constructor(value: string, name: string, url: string) {
        this.name = name;
        this.value = value;
        this.url = url;
    }

    abstract getUrl({gender, sort, page}: {gender: string, sort: string, page: number}): string;

    abstract getMovies({movies, resp, event}: {movies: Movies, resp: any, event?: any}): Movies;

    abstract getNbMovies(resp: any): number;

    abstract getMoviesList(resp: any): Movie[];

    abstract getTorrent(torrent: any): Torrent[];
}
