/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   User.ts                                            :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/11 14:25:35 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/11 14:36:44 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

export class User {
    '@context': string;
    '@id': string;
    '@type': string;
    avatar: {
        '@id': string,
        '@type': string,
        contentUrl: string
    };
    avatarUrl: string;
    createdAt: string;
    email: string;
    enabled: boolean;
    firstname: string;
    groups: Array<any>;
    id: number;
    lang: string;
    lastLogin: string;
    lastname: string;
    oAuthAccess: boolean;
    roles: Array<string>;
    updatedAt: string;
    username: string;
}
