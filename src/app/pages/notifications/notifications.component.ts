import { Component, OnInit } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { Catalog } from 'src/shared/model/catalog.model';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  unbTvVideos: IVideo[] = [];
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  userId: string = ''; 
  user: any; 
  isAuthenticated: boolean = false; 
  favoriteVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();
  numberOfFavoriteVideos: number = 0;

  constructor(
    private videoService: VideoService,
    private authService: AuthService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.setUserIdFromToken(localStorage.getItem('token') as string);
      await this.findAll();
      await this.getFavoriteVideos();
    }
    this.notificationService.fetchFavoriteVideosCount();
  }

  getUserDetails() {
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }

  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }

  getFavoriteVideos(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isAuthenticated) {
        this.videoService.getFavoriteVideos(this.userId).subscribe({
          next: (data) => {
            if (data && Array.isArray(data.videoList)) {
              this.favoriteVideos = data.videoList.map((item: any) => {

                const video = this.unbTvVideos.find(video => String(video.id) === String(item.video_id));
                return video || null;
              }).filter((video: IVideo | null): video is IVideo => video !== null); 
              
             
              this.numberOfFavoriteVideos = this.favoriteVideos.length;
              this.notificationService.updateFavoriteVideosCount(this.numberOfFavoriteVideos);
              
            } else {
              console.warn('A estrutura da resposta da API não está conforme o esperado:', data);
            }
            resolve();
          },
          error: (error) => {
            console.log('Erro ao buscar vídeos marcados como "favoritos"', error);
            reject(error);
          }
        });
      } else {
        resolve();
      }
    });
  }

  findAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.videoService.findAll().subscribe({
        next: (data) => {
          this.videosEduplay = data.body?.videoList ?? [];
        },
        error: (error) => {
          console.log(error);
          reject(error);
        },
        complete: () => {
          this.filterVideosByChannel(this.videosEduplay);
          this.videoService.videosCatalog(this.unbTvVideos, this.catalog);
          resolve();
        },
      });
    });
  }

  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;

      if (channel && channel[0].id === this.unbTvChannelId) {
        this.unbTvVideos.push(video);
      }
    });
  }

  trackByVideoId(index: number, video: IVideo): string {
    return video.id ? video.id.toString() : index.toString();
  }

}
