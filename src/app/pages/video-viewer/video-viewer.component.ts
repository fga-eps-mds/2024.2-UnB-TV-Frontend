import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { VideoService } from '../../services/video.service';
import { IVideo, Video } from 'src/shared/model/video.model';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';

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

  expandDescription() {
    this.showDescription = !this.showDescription;
  }

  constructor(
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
    }

    this.findVideoById();
    iframe.src = this.eduplayVideoUrl + this.idVideo;
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
        // console.log(this.isWatchLater);
        // console.log(this.isFavorite);
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
    //console.log(`Checking watch later status for video ID: ${this.idVideo}, User ID: ${this.userId}`);
    this.videoService.checkWatchLater(this.idVideo.toString(), this.userId.toString()).subscribe({
      next: (response) => {
        this.isWatchLater = response.status; // Acessa a propriedade status do objeto response
        //console.log('Watch later status:', this.isWatchLater);
      },
      error: (err) => {
        console.error('Error checking watch later status', err);
      }
    });
  }
  

  // Favoritar
  toggleFavorite() {
    //console.log('User ID when toggling favorite:', this.userId);
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      this.videoService.addToFavorite(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          //console.log('Video added to favorites list');
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
          //console.log('Video removed from favorite list');
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
    //console.log(`Checking favorite status for video ID: ${this.idVideo}, User ID: ${this.userId}`);
    this.videoService.checkFavorite(this.idVideo.toString(), this.userId.toString()).subscribe({
      next: (response) => {
        //console.log(response); // Exibe a resposta completa
        this.isFavorite = response.statusfavorite; // Verifique se a resposta tem a estrutura correta
        //console.log('Favorite status:', this.isFavorite);
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