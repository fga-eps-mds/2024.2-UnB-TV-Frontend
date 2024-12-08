import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoService } from '../../services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { AlertService } from 'src/app/services/alert.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.css'],
})

export class VideoComponent implements OnInit {
  unbTvVideos: IVideo[] = [];
  isFavorite = true;
  idVideo!: number;
  userId: string = '';
  user: any;
  favoriteMessage: string | null = null; // Armazena a mensagem
  eduplayVideoUrl = "https://eduplay.rnp.br/portal/video/embed/";

  constructor(
    private videoService: VideoService,
    private router: Router,
    private alertService: AlertService,
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getVideos();
    const iframe = document.getElementById('embeddedVideo') as HTMLIFrameElement;
    if (this.authService.isAuthenticated()) {
      this.setUserIdFromToken(localStorage.getItem('token') as string);
      this.getUserDetails();
    }
    // Carrega o vídeo específico e ajusta o iframe
    this.findVideoById();
    if (iframe && this.idVideo) {
      iframe.src = `${this.eduplayVideoUrl}${this.idVideo}`;
    }
  }

  getVideos(): void {
    this.videoService.getVideosCatalog().subscribe({
      next: (videos) => {
        this.unbTvVideos = videos;
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  setUserIdFromToken(token: string): void {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }

  getUserDetails(): void {
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.checkFavoriteStatus(); // Checa o status de favoritos
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      },
    });
  }

  findVideoById(): void {
    // Aqui você deve definir como pegar o idVideo, talvez com route ou outro método
    // Como você já tem o idVideo, só faz a requisição
    this.videoService.findVideoById(this.idVideo).subscribe({
      next: (data) => {
        // Aqui você pode armazenar o vídeo retornado, como já está no código original
      },
      error: (err) => {
        console.error('Error fetching video details', err);
      },
    });
  }

  // Favoritar
  toggleFavorite(video: IVideo): void {
  const videoId = video.id ?? 0; // Se video.id for undefined, usa 0 como valor

  // Altera o estado do vídeo
  video.isFavorited = !video.isFavorited;

  if (video.isFavorited) {
    this.videoService.addToFavorite(videoId.toString(), this.userId.toString()).subscribe({
      next: () => {
        this.alertService.showMessage("success", "Sucesso", "Vídeo adicionado à lista de Favoritos");
      },
      error: (err) => {
        console.error('Error adding to favorite', err);
        this.alertService.showMessage('error', 'Erro', 'Erro ao adicionar o vídeo para lista de favoritos');
      }
    });
  } else {
    this.videoService.removeFromFavorite(videoId.toString(), this.userId.toString()).subscribe({
      next: () => {
        this.alertService.showMessage("success", "Sucesso", "Vídeo removido da lista de Favoritos");
      },
      error: (err) => {
        console.error('Error removing from favorite', err);
        this.alertService.showMessage('error', 'Erro', 'Erro ao remover o vídeo da lista de favoritos');
      }
    });
  }
}


  checkFavoriteStatus(): void {
    this.videoService.checkFavorite(this.idVideo.toString(), this.userId.toString()).subscribe({
      next: (response) => {
        this.isFavorite = response.statusfavorite; // Verifique se a resposta tem a estrutura correta
      },
      error: (err) => {
        console.error('Error checking favorite status', err);
      }
    });
  }

  showFavoriteMessage(isFavorite: boolean): void {
    const message = isFavorite ? 'Vídeo favoritado!' : 'Vídeo desfavoritado!';
    this.favoriteMessage = message;  // Armazena a mensagem na variável
    alert(message);  // Exemplo de alert, mas você pode customizar com mensagens na tela
  }

  returnToCatalog(): void {
    this.router.navigate(['/catalog']);
  }

  // Função que retorna a URL do vídeo
  getVideoUrl(): string {
    return `${this.eduplayVideoUrl}${this.idVideo}`;
  }
}
