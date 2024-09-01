import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IVideo } from 'src/shared/model/video.model';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { Catalog } from 'src/shared/model/catalog.model';
import jwt_decode from 'jwt-decode';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';


@Component({
  selector: 'app-favorite-videos',
  templateUrl: './favorite-videos.component.html',
  styleUrls: ['./favorite-videos.component.css']
})
export class FavoriteVideosComponent implements OnInit {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();
  userId: string; // Adicionado para armazenar os detalhes do usuário
  user: any;
  favoriteVideos: IVideo[] = [];

  constructor(
    private userService: UserService,
    private videoService: VideoService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.setUserIdFromToken(localStorage.getItem('token') as string);
    try {
      await this.findAll(); // Aguarde findAll() antes de continuar
      this.getUserDetails(); 
    } catch (error) {
      console.error('Erro ao buscar os vídeos:', error);
    }
  }
  

  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }
 
  getUserDetails() {
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.getFavoriteVideos();
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }

  getFavoriteVideos(): void {
    this.videoService.getFavoriteVideos(this.userId).subscribe({
      next: (data) => {
        if (data && Array.isArray(data.videoList)) {
          const favorite_videos_ids = data.videoList.map((item: any) => String(item.video_id)); // Converta IDs para string

          this.favoriteVideos = this.unbTvVideos.filter(video => favorite_videos_ids.includes(String(video.id))); // Converta IDs para string
        } else {
          console.warn('A estrutura da resposta da API não está conforme o esperado:', data);
        }
      },
      error: (error) => {
        console.log('Erro ao buscar vídeos marcados como "favoritos"', error);
      }
    });
  }

  findAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.videoService.findAll().subscribe({
        next: (data) => {
          this.videosEduplay = data.body?.videoList ?? [];
          this.filterVideosByChannel(this.videosEduplay);
          this.videoService.videosCatalog(this.unbTvVideos, this.catalog);
          resolve(); // Resolva a promessa quando o findAll() estiver concluído
        },
        error: (error) => {
          console.log(error);
          reject(error); // Rejeite a promessa em caso de erro
        }
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
}