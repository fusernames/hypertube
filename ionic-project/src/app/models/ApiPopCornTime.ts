/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ApiPopCornTime.ts                                  :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 10:12:47 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 02:12:24 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Api } from './Api';
import { Movie } from './Movie';
import { Movies } from './Movies';
import { Torrent } from './Torrent';

export class ApiPopCornTime extends Api {
    constructor() {
        super('popcorntime', 'Popcorntime', 'https://tv-v2.api-fetch.website/movies/');
    }

    getUrl({gender, sort, page}: {gender: string, sort: string, page: number}): string {
        const pagination = page > 1 ? `${page}1?` : '1?';
        sort = sort !== 'none' ? `sort='${sort}` : '';
        gender = gender !== 'none' ? `&genre=${gender}` : '';

        return `${this.url}${pagination}${sort}${gender}`;
    }

    getMovies({movies, resp, event}: {movies: Movies, resp: any, event?: any}): Movies {
        movies.movies = event ? movies.movies.concat(this.getMoviesList(resp)) : this.getMoviesList(resp);
        movies.nbMovies = this.getNbMovies(movies.movies);

        return movies;
    }

    getNbMovies(resp: any): number {
        return resp.length;
    }

    getMoviesList(resp: any): Movie[] {
        return resp.map(
            (movie: any) => new Movie(movie._id,
                                    movie.images.poster,
                                    '',
                                    movie.synopsis,
                                    movie.genres,
                                    '',
                                    movie.rating.percentage / 10,
                                    movie.year,
                                    this.getTorrent(movie.torrents),
                                    movie.trailer.replace('http://youtube.com/watch?v=', 'https://www.youtube.com/embed/'),
                                    movie.title)
        );
    }

    getTorrent(torrent: any): Torrent[] {
        const lang = Object.getOwnPropertyNames(torrent.en);

        return lang.map(
            (language: string) => {
                const size = torrent.en[language].filesize;
                const url = torrent.en[language].url;
                return new Torrent(size, url, language);
            }
        );
    }
}
