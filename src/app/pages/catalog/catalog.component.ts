import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent implements OnInit {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();
  filteredVideos: IVideo[] = [];
  filterTitle: string = '';
  filterWatchLater: boolean = false; // Adicionado para o filtro de "assistir mais tarde"
  watchLaterVideos: IVideo[] = []; // Adicionado para armazenar vídeos de "assistir mais tarde"
  userId: string = ''; // Adicionado para armazenar o ID do usuário
  user: any; // Adicionado para armazenar os detalhes do usuário
  isAuthenticated: boolean = false; // Propriedade pública para o estado de autenticação
  filterFavorite: boolean = false;
  favoriteVideos: IVideo[] = [];

  constructor(
    private videoService: VideoService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.setUserIdFromToken(localStorage.getItem('token') as string);
      this.getUserDetails();
    }
    this.findAll();
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
        this.getWatchLaterVideos(); // Carregue os vídeos de "assistir mais tarde" após obter os detalhes do usuário
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }

  findAll(): void {
    this.videoService.findAll().subscribe({
      next: (data) => {
        this.videosEduplay = data.body?.videoList ?? [];
        this.filterVideosByChannel(this.videosEduplay);
        this.filterVideos(); // Atualize a filtragem após carregar todos os vídeos
        this.videoService.videosCatalog(this.unbTvVideos, this.catalog);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  getFavoriteVideos(): void {
    if (this.isAuthenticated) {
      this.videoService.getFavoriteVideos(this.userId).subscribe({
        next: (data) => {
          //console.log('Resposta completa da API para vídeos de "favoritos":', data);
  
          // Verifique se `videoList` existe e é um array
          if (data && Array.isArray(data.videoList)) {
            //console.log('videoList existe e é um array:', data.videoList);
            const favorite_videos_ids = data.videoList.map((item: any) => String(item.video_id)); // Converta IDs para string
            //console.log('IDs dos vídeos "favoritos":', favorite_videos_ids);
  
            this.favoriteVideos = this.unbTvVideos.filter(video => favorite_videos_ids.includes(String(video.id))); // Converta IDs para string
            //console.log('Vídeos marcados como "favoritos" após filtragem:', this.favoriteVideos);
          } else {
            console.warn('A estrutura da resposta da API não está conforme o esperado:', data);
          }
  
          this.filterVideos(); // Atualize a filtragem após carregar os vídeos de "favoritos"
        },
        error: (error) => {
          console.log('Erro ao buscar vídeos marcados como "favoritos"', error);
        }
      });
    }
  }

  onFilterFavoriteVideosChange() {
    if (this.filterFavorite) {
      this.getFavoriteVideos();
    } else {
      this.filterVideos();
    }
  }

  getWatchLaterVideos(): void {
    if (this.isAuthenticated) {
      this.videoService.getWatchLaterVideos(this.userId).subscribe({
        next: (data) => {
          // console.log('Resposta completa da API para vídeos de "assistir mais tarde":', data);
  
          // Verifique se `videoList` existe e é um array
          if (data && Array.isArray(data.videoList)) {
            // console.log('videoList existe e é um array:', data.videoList);
            const watchLaterVideoIds = data.videoList.map((item: any) => String(item.video_id)); // Converta IDs para string
            // console.log('IDs dos vídeos "assistir mais tarde":', watchLaterVideoIds);
  
            this.watchLaterVideos = this.unbTvVideos.filter(video => watchLaterVideoIds.includes(String(video.id))); // Converta IDs para string
            // console.log('Vídeos marcados como "assistir mais tarde" após filtragem:', this.watchLaterVideos);
          } else {
            console.warn('A estrutura da resposta da API não está conforme o esperado:', data);
          }
  
          this.filterVideos(); // Atualize a filtragem após carregar os vídeos de "assistir mais tarde"
        },
        error: (error) => {
          console.log('Erro ao buscar vídeos marcados como "assistir mais tarde"', error);
        }
      });
    }
  }

  onFilterWatchLaterChange() {
    if (this.filterWatchLater) {
      this.getWatchLaterVideos();
    } else {
      this.filterVideos();
    }
  }
  

  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;
      if (channel && channel[0].id === this.unbTvChannelId) {
        this.unbTvVideos.push(video);
      }
    });
  }

  filterVideos() {
    this.filteredVideos = this.unbTvVideos.filter(video => {
      const isWatchLater = this.filterWatchLater ? this.watchLaterVideos.some(wlVideo => wlVideo.id == video.id) : true;
      const isFavorite = this.filterFavorite? this.favoriteVideos.some(wlVideo => wlVideo.id == video.id) : true;
      const matchesTitle = this.filterTitle ? video.title?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      const matchesDescription = this.filterTitle ? video.description?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      const matchesKeywords = this.filterTitle ? video.keywords?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      const matchesCatalog = this.filterTitle ? video.catalog?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      
      return isWatchLater && isFavorite && (matchesTitle || matchesDescription || matchesKeywords || matchesCatalog);
    });
  }

  onProgramClick(videos: IVideo[]) {
    this.videoService.setVideosCatalog(videos);
    this.router.navigate(['/videos']);
  }
}
