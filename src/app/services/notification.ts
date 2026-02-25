import { Injectable } from '@angular/core';
<<<<<<< HEAD
import { BehaviorSubject } from 'rxjs';
=======
import { Subject } from 'rxjs';
>>>>>>> 117e3a9

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
<<<<<<< HEAD
  private notificationSubject = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notificationSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationSubject.next({ message, type });
    setTimeout(() => this.notificationSubject.next(null), 3000);
=======
  private notificationSubject = new Subject<Notification>();
  public notification$ = this.notificationSubject.asObservable();

  show(message: string, type: 'success' | 'error' | 'info' = 'info') {
    this.notificationSubject.next({ message, type });
>>>>>>> 117e3a9
  }
}
