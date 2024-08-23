import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { VideoService } from 'src/app/services/video.service';
import { AuthService } from 'src/app/services/auth.service';
import { IVideo } from 'src/shared/model/video.model';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private favoriteVideosCountSource = new BehaviorSubject<number>(0);
  favoriteVideosCount$ = this.favoriteVideosCountSource.asObservable();
  private userId: string = '';
  private favoriteVideos: IVideo[] = [];

  constructor(
    private videoService: VideoService,
    private authService: AuthService
  ) {}

  updateFavoriteVideosCount(count: number) {
    this.favoriteVideosCountSource.next(count);
  }

  fetchFavoriteVideosCount(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.authService.isAuthenticated()) {
        this.setUserIdFromToken(localStorage.getItem('token') as string);
        this.videoService.getFavoriteVideos(this.userId).subscribe({
          next: (data) => {
            if (data && Array.isArray(data.videoList)) {
              this.favoriteVideos = data.videoList.map((item: any) => {
               
                return { id: item.video_id, ...item };
              });

              const newCount = this.favoriteVideos.length;
              this.updateFavoriteVideosCount(newCount);
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

  private setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }
}
