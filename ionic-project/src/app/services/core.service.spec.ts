/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   core.service.spec.ts                               :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: dlavaury <dlavaury@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2019/04/07 18:36:44 by dlavaury          #+#    #+#             */
/*   Updated: 2019/04/07 18:36:52 by dlavaury         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

import { TestBed } from '@angular/core/testing';

import { CoreService } from './core.service';

describe('CoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoreService = TestBed.get(CoreService);
    expect(service).toBeTruthy();
  });
});
