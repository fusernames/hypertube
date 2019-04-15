import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tabs4',
  templateUrl: './tabs4.page.html',
  styleUrls: ['./tabs4.page.scss'],
})
export class Tabs4Page implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onLogout(): void {
    this.authService.logout();
  }
}
