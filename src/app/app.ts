import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserService } from './services/user';
import { NotificationComponent } from './components/notification/notification';
import { Footer } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('cozy-gen');
  private userService = inject(UserService);

  ngOnInit() {
    this.userService.checkAdminStatus();
  }
}
