import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { NotificationService } from 'src/app/services/notification.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.css'],
  providers: [MessageService],
})
export class BackgroundComponent implements OnInit, OnDestroy {
  items: MenuItem[] = [];
  mobileDevide: boolean = true;
  hasNotifications: boolean = false; // Indica se há notificações
  private intervalSubscription: Subscription | null = null;
  // Variável para armazenar o estado atual do tema
  isDarkMode: boolean = false;


  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    console.log('BackgroundComponent initialized');
    // Verificações para o Dark Mode e Persistência de Dados
    const savedTheme = localStorage.getItem('theme');
    this.isDarkMode = savedTheme === 'dark';
    this.applyTheme();
    // Configurar o menu inicial
    this.items = [
      {
        label: 'Perfil',
        routerLink: '/profile',
      },
      {
        label: `Notificações`,
        routerLink: '/notifications',
        escape: false,
      },
    ];

    // Assinar notificações
    this.notificationService.recommendedVideosCount$.subscribe((count) => {
      this.hasNotifications = count > 0; // Verifica se há notificações
      this.updateNotificationLabel();
    });

    if (this.notificationService.isAuthenticated()) {
      console.log('User is authenticated');
      const token = localStorage.getItem('token') as string;
      this.notificationService.setUserIdFromToken(token);
      const userId = this.notificationService.userId;
      this.notificationService
        .fetchRecommendedVideosCount(userId)
        .subscribe((response) => {
          console.log('Response from fetchRecommendedVideosCount:', response);
          this.updateNotificationCount(response);
        });
    } else {
      console.log('User is not authenticated');
    }

    this.intervalSubscription = interval(300000).subscribe(() => {
      if (this.notificationService.isAuthenticated()) {
        const token = localStorage.getItem('token') as string;
        this.notificationService.setUserIdFromToken(token);
        const userId = this.notificationService.userId;
        this.notificationService
          .fetchRecommendedVideosCount(userId)
          .subscribe((response) => {
            console.log('Response from interval fetch:', response);
            this.updateNotificationCount(response);
          });
      }

      this.notificationService.recommendedVideosCount$.subscribe((count) => {
        console.log('New notifications count (from BehaviorSubject):', count);
        this.hasNotifications = count > 0; // Verifica se há notificações
        this.updateNotificationLabel();
      });
    });

    this.identifiesUserDevice();
  }

  ngOnDestroy(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  toggleDarkMode(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      document.documentElement.classList.add('dark-theme');
      this.isDarkMode = true;
      localStorage.setItem('theme', 'dark'); // Salvando o estado atual no localStorage
    } else {
      document.documentElement.classList.remove('dark-theme');
      this.isDarkMode = false;
      localStorage.setItem('theme', 'light'); 
    }
  }

  applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
    }
    this.cdr.detectChanges(); // Atualiza a interface se necessário
  }

  updateNotificationCount(response: any): void {
    if (response?.recommend_videos && response.recommend_videos.length > 0) {
      const count = response.recommend_videos.length;
      console.log('Updating notification count with:', count);
      this.hasNotifications = count > 0;
      this.notificationService.updateRecommendedVideosCount(count);
      this.updateNotificationLabel();
    } else {
      console.log('No videos found in response');
      this.hasNotifications = false;
      this.updateNotificationLabel();
    }
  }

  identifiesUserDevice(): void {
    const userAgent = navigator.userAgent;
    this.mobileDevide =
      /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(userAgent);
  }

  getActualRoute(): string {
    return window.location.pathname;
  }

  updateNotificationLabel(): void {
    console.log('Updating notification label');
    this.items = this.items.map((item) => {
      if (item.routerLink === '/notifications') {
        item.label = `Notificações ${
          this.hasNotifications
            ? '<span class="notification-badge"></span>'
            : ''
        }`;
      }
      return item;
    });
    this.cdr.detectChanges(); // Certifique-se de que a interface seja atualizada
  }
}
