/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   Message.ts                                         :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 23:39:46 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/11 23:40:10 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { User } from './User';

export class Message {
    '@id': string;
    '@type': string;
    'id': number;
    'owner': User;
    'createdAt': string;
    'updatedAt': string;
    'message': string;
    'movie': string;
}
