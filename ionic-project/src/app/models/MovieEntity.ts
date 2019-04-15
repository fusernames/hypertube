/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MovieEntity.ts                                     :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 17:40:50 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/15 05:14:06 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class MovieEntity {
    '@id': string;
    '@type': string;
    createdAt: string;
    fileName: string;
    finished: boolean;
    id: number;
    name: string;
    torrentId: number;
    torrentLink: string;
    updatedAt: string;
    image: string;
    APIId: number;
    messages: [string];
    movieStatuses: [string];
    rating: number;
    year: number;
    title: string;
    description: string;
}
