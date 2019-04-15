/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   ApiYts.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 10:01:37 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 02:12:58 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { Api } from './Api';
import { Movie } from './Movie';
import { Movies } from './Movies';
import { Torrent } from './Torrent';

export class ApiYts extends Api {
    constructor() {
        super('yts', 'YTS', 'https://yts.am/api/v2/list_movies.json?limit=50');
    }

    getUrl({gender, sort, page}: {gender: string, sort: string, page: number}): string {
        const pagination = page > 1 ? `&page=${page}` : '';
        sort = `&sort_by=${sort === 'none' ? 'like_count' : sort}`;
        gender = gender !== 'none' ? `&genre=${gender}` : '';

        return this.url + sort + gender + pagination;
    }

    getMovies({movies, resp, event}: {movies: Movies, resp: any, event?: any}): Movies {
        // console.log(resp);
        movies.nbMovies = this.getNbMovies(resp);
        movies.movies = event ? movies.movies.concat(this.getMoviesList(resp)) : this.getMoviesList(resp);

        return movies;
    }

    getNbMovies(resp: any): number {
        return resp.data.movie_count;
    }

    getMoviesList(resp: any): Movie[] {
        return resp.data.movies.map(
            (movie: any) => new Movie(movie.id,
                                    movie.large_cover_image,
                                    movie.date_uploaded,
                                    movie.synopsis,
                                    movie.genres,
                                    movie.language,
                                    movie.rating,
                                    movie.year,
                                    this.getTorrent(movie.torrents),
                                    `https://www.youtube.com/embed/${movie.yt_trailer_code}`,
                                    movie.title)
        );
    }

    getTorrent(torrent: any): Torrent[] {
        return torrent.map(
            (item: any) => new Torrent(item.size, item.url, item.quality)
        );
    }
}
