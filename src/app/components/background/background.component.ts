import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css'],
  providers: [MessageService],
})
export class BackgroundComponent implements OnInit {
  items: MenuItem[] = [];
  mobileDevide: boolean = true;
  newNotificationsCount: number = 0; 

 //constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Perfil',
        routerLink: '/profile',
      },
      {
        label: 'Histórico de Vídeos',
        routerLink: '/record',
      },
      {
        label: `Notificações <span class="notification-badge">
            ${this.newNotificationsCount}</span>`,
        routerLink: '/notifications',
        escape: false,
      }      
    ];
      /*this.notificationService.fetchFavoriteVideosCount();

      setInterval(() => {
        this.notificationService.fetchFavoriteVideosCount();
        
        this.notificationService.favoriteVideosCount$.subscribe(count => {
          this.newNotificationsCount = count; 
          this.updateNotificationLabel();
        });
      }, 5000); */// Atualiza a cada 5 segundos
      

    this.identifiesUserDevice();
  }

  identifiesUserDevice(): void {
    if (
      RegExp(/Android/i).exec(navigator.userAgent) ||
      RegExp(/iPhone/i).exec(navigator.userAgent) ||
      RegExp(/iPad/i).exec(navigator.userAgent) ||
      RegExp(/iPod/i).exec(navigator.userAgent) ||
      RegExp(/BlackBerry/i).exec(navigator.userAgent) ||
      RegExp(/Windows Phone/i).exec(navigator.userAgent)
    ) {
      this.mobileDevide = true; // está utilizando dispositivo móvel
    } else {
      this.mobileDevide = false;
    }
  }
  
  getActualRoute(): string {
    return window.location.pathname;
  }

  updateNotificationLabel(): void {
    this.items = this.items.map(item => {
      if (item.routerLink === '/notifications') {
        return {
          ...item,
          label: `Notificações <span class="notification-badge">${this.newNotificationsCount}</span>`,
          escape: false,
        };
      }
      return item;
    });
  }

}
