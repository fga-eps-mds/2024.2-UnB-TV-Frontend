import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { VideoService } from '../../services/video.service';
import { IVideo, Video } from 'src/shared/model/video.model';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { Catalog } from 'src/shared/model/catalog.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-video-viewer',
  templateUrl: './video-viewer.component.html',
  styleUrls: ['./video-viewer.component.css'],
})
export class VideoViewerComponent implements OnInit {
  videoDescription: string = '';
  characterLimit = 100;
  showDescription = false;
  video: IVideo = new Video();
  idVideo!: number;
  isWatchLater = true;
  isFavorite = true;
  eduplayVideoUrl = "https://eduplay.rnp.br/portal/video/embed/";
  userId: string = '';
  user : any;
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();
  categoryVideo: any;
  videosAssistidos: IVideo[] = [];
  recordVideos: any;
  filteredVideos: IVideo[] = [];
  program: any;
  videosByCategory: IVideo[] = [];
  idNextVideo: number;
  titleNextVideo: any;
  showTitleNextVideo: boolean = false;

  expandDescription() {
    this.showDescription = !this.showDescription;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private videoService: VideoService,
    private userService: UserService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    const iframe = document.getElementById('embeddedVideo') as HTMLIFrameElement;
    this.idVideo = this.route.snapshot.params['idVideo'];

    if (this.authService.isAuthenticated()){
      this.setUserIdFromToken(localStorage.getItem('token') as string);
      this.getUserDetails();
      this.addRecord();
    }

    this.findVideoById();
    iframe.src = this.eduplayVideoUrl + this.idVideo;
    this.checkRecord();
  }
  
  checkRecord(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.videoService.checkRecord(this.userId.toString()).subscribe({
        next: (response) => {
          this.recordVideos = response;
          resolve();
        },
        error: (err) => {
          console.error('Error checking record', err);
          reject(err);
        }
      });
    });
  }

  //Função responsável por trazer todos os vídeos já assistidos pelo usuário
  filterVideosByRecord(): void {
    const keys = Object.keys(this.recordVideos.videos).map(id => parseInt(id, 10))
    this.filteredVideos = this.unbTvVideos.filter(video => video.id !== undefined && keys.includes(video.id));
  }

  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }

  getUserDetails() {
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.checkWatchLaterStatus();
        this.checkFavoriteStatus();
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }

  addRecord() {
    this.videoService.addToRecord(this.userId, this.idVideo.toString()).subscribe({
      next: () => {
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }

  findVideoById = () => {
    this.videoService.findVideoById(this.idVideo).subscribe({
      next: (data: HttpResponse<IVideo>) => {
        this.video = data.body ? data.body : this.video;
        this.videoDescription = this.video.description
          ? this.video.description
          : '';
      },
      error: (err) => {
        console.error('Error fetching video details', err);
      }
    });
  };

  // Assistir mais tarde
  toggleWatchLater() {
    this.isWatchLater = !this.isWatchLater;
    if (this.isWatchLater) {
      this.videoService.addToWatchLater(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          this.alertService.showMessage("success", "Sucesso", "Vídeo adicionado à lista de Assistir Mais tarde");
        },
        error: (err) => {
          console.error('Error adding to watch later', err);
          this.alertService.showMessage('error', 'Erro', 'Erro ao adicionar o vídeo para assistir mais tarde')
        }
      });
    } else {
      this.videoService.removeFromWatchLater(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          this.alertService.showMessage("success", "Sucesso", "Vídeo removido da lista de Assistir mais tarde.");
        },
        error: (err) => {
          console.error('Error removing from watch later', err);
          this.alertService.showMessage('error', 'Erro', 'Erro ao remover o vídeo da lista de assistir mais tarde')
        }
      });
    }
  }

  checkWatchLaterStatus() {
    this.videoService.checkWatchLater(this.idVideo.toString(), this.userId.toString()).subscribe({
      next: (response) => {
        this.isWatchLater = response.status; // Acessa a propriedade status do objeto response
      },
      error: (err) => {
        console.error('Error checking watch later status', err);
      }
    });
  }
  

  // Favoritar
  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      this.videoService.addToFavorite(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          this.alertService.showMessage("success", "Sucesso", "Vídeo adicionado à lista de Favoritos");
        },
        error: (err) => {
          console.error('Error adding to favorite', err);
          this.alertService.showMessage('error', 'Erro', 'Erro ao adicionar o vídeo para lista de favoritos')
        }
      });
    } else {
      this.videoService.removeFromFavorite(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          this.alertService.showMessage("success", "Sucesso", "Vídeo removido da lista de Favoritos");
        },
        error: (err) => {
          console.error('Error removing from favorite', err);
          this.alertService.showMessage('error', 'Erro', 'Erro ao remover o vídeo da lista de favoritos')
        }
      });
    }
  }

  checkFavoriteStatus() {
    this.videoService.checkFavorite(this.idVideo.toString(), this.userId.toString()).subscribe({
      next: (response) => {
        this.isFavorite = response.statusfavorite; // Verifique se a resposta tem a estrutura correta
      },
      error: (err) => {
        console.error('Error checking favorite status', err);
      }
    });
  }

  getVideoUrl(): string {
    return `${this.eduplayVideoUrl}${this.idVideo}`;
  }

  shareVideo() {
    const shareData = {
      title: this.video.title,
      text: this.video.title,
      url: window.location.href,
    };

    if (navigator.canShare()) {
      navigator.share(shareData)
        .then(() => console.log('Compartilhado com sucesso'))
        .catch((error) => console.error('Erro ao compartilhar:', error));
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url)
        .then(() => console.log('URL copiada com sucesso'))
        .catch((error) => console.error('Erro ao copiar URL:', error));

      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(shareData.title + ' ' + shareData.url)}`;
        window.location.href = whatsappUrl;
      }
    } else {
      console.warn('A API de compartilhamento não é suportada neste navegador.');
    }
  }
}
