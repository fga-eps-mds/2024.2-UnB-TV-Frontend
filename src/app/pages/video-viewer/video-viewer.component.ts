import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { VideoService } from '../../services/video.service';
import { IVideo, Video } from 'src/shared/model/video.model';
import { UserService } from 'src/app/services/user.service';
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
  user :any;

  expandDescription() {
    this.showDescription = !this.showDescription;
  }

  constructor(
    private route: ActivatedRoute,
    private videoService: VideoService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const iframe = document.getElementById('embeddedVideo') as HTMLIFrameElement;
    this.idVideo = this.route.snapshot.params['idVideo'];
    console.log('ID do vídeo:', this.idVideo);

    this.setUserIdFromToken(localStorage.getItem('token') as string);
    this.getUserDetails();
    this.findVideoById();
    iframe.src = this.eduplayVideoUrl + this.idVideo;
  }

  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
    console.log('Decoded User ID:', this.userId);
  }

  getUserDetails() {
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        console.log('Fetched User:', user); // Log para verificar o objeto `user`
        this.user = user;
        this.checkWatchLaterStatus();
        console.log(this.isWatchLater);
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
    console.log('User ID when toggling watch later:', this.userId);
    this.isWatchLater = !this.isWatchLater;
    if (this.isWatchLater) {
      this.videoService.addToWatchLater(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          console.log('Video added to watch later list');
          alert('Vídeo adicionado à lista de "Assistir Mais Tarde".');
        },
        error: (err) => {
          console.error('Error adding to watch later', err);
        }
      });
    } else {
      this.videoService.removeFromWatchLater(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          console.log('Video removed from watch later list');
          alert('Vídeo removido da lista de "Assistir Mais Tarde".');
        },
        error: (err) => {
          console.error('Error removing from watch later', err);
        }
      });
    }
  }

  checkWatchLaterStatus() {
    console.log(`Checking watch later status for video ID: ${this.idVideo}, User ID: ${this.userId}`);
    this.videoService.checkWatchLater(this.idVideo.toString(), this.userId.toString()).subscribe({
      next: (response) => {
        console.log(response); // Exibe a resposta completa
        this.isWatchLater = response.status; // Acessa a propriedade status do objeto response
        console.log('Watch later status:', this.isWatchLater);
      },
      error: (err) => {
        console.error('Error checking watch later status', err);
      }
    });
  }

  // Favoritar
  toggleFavorite() {
    console.log('User ID when toggling favorite:', this.userId);
    this.isFavorite = !this.isFavorite;
    if (this.isFavorite) {
      this.videoService.addToFavorite(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          console.log('Video added to favorites list');
          alert('Vídeo adicionado à lista de "Favoritos".');
        },
        error: (err) => {
          console.error('Error adding to favorite', err);
        }
      });
    } /*else {
      this.videoService.removeFromFavorite(this.idVideo.toString(), this.userId.toString()).subscribe({
        next: () => {
          console.log('Video removed from favorite list');
          alert('Vídeo removido da lista de "Favoritos".');
        },
        error: (err) => {
          console.error('Error removing from favorite', err);
        }
      });
    }*/
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
