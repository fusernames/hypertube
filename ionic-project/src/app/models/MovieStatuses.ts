/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   MovieStatuses.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 17:41:57 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/11 17:52:37 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { MovieEntity } from './MovieEntity';

export class MovieStatuses {
    id: number;
    movie: MovieEntity;
    time: number;
    updatedAt: string;
    user: string;
}
