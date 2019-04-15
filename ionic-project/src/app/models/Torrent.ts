/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Torrent.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/10 18:54:28 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/10 19:01:06 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class Torrent {
    constructor(public size: string, public url: string, public quality: string) {}
}
