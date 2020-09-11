import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss']
})
export class AppRootComponent {

  constructor(router: Router) {
    const path = localStorage.getItem('path');
    if (path) {
      localStorage.removeItem('path');
      router.navigate([path]);
    }
  }
}
