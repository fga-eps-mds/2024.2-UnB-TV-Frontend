import { Component, OnInit, HostListener } from '@angular/core';
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
  isFavorite: boolean;
  idVideo!: number;
  userId: string = '';
  user: any;
  favoriteMessage: string | null = null; // Armazena a mensagem
  eduplayVideoUrl = "https://eduplay.rnp.br/portal/video/embed/";
  isWatchLater: boolean;
  isDesktop: boolean = false;
  constructor(
    public videoService: VideoService,
    public router: Router,
    public alertService: AlertService,
    public authService: AuthService,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.getVideos();
    this.isDesktop = window.innerWidth > 768; // Detecta se é desktop
    const iframe = document.getElementById('embeddedVideo') as HTMLIFrameElement;
    if (this.authService.isAuthenticated()) {
      this.setUserIdFromToken(localStorage.getItem('token') as string);
      this.getUserDetails();
    }
    // Carrega o vídeo específico e ajusta o iframe
    if (iframe && this.idVideo) {
      iframe.src = `${this.eduplayVideoUrl}${this.idVideo}`;
    }
  }

  //criar outra func fora depois do if do ngonint criar a funcao para filtrar 
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
        this.checkFavorites(); // Checa o status de favoritos
        this.checkWatchLater();
      },
      error: (err) => {
        console.error('Error fetching user details', err);
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

  checkFavorites(){
    this.unbTvVideos.forEach(video=>{
      if(video.id)
        this.checkFavoriteStatus(video.id);
    })
  }
  
  checkFavoriteStatus(videoId: number): void {
    this.videoService.checkFavorite(videoId.toString(), this.userId.toString()).subscribe({
      next: (response) => {
        this.isFavorite = response.statusfavorite; // Verifique se a resposta tem a estrutura correta
        let index = this.unbTvVideos.findIndex(video=>video.id==videoId);
        this.unbTvVideos[index].isFavorited = response.statusfavorite;
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

  // Assistir mais tarde
  toggleWatchLater(video: IVideo): void {
    const videoId = video.id ?? 0;

    video.isWatchLater = !video.isWatchLater;

    if (video.isWatchLater) {
      this.videoService.addToWatchLater(videoId.toString(), this.userId.toString()).subscribe({
        next: () => {
          this.alertService.showMessage("success", "Sucesso", "Vídeo adicionado à lista de Assistir Mais tarde");
        },
        error: (err) => {
          console.error('Error adding to watch later', err);
          this.alertService.showMessage('error', 'Erro', 'Erro ao adicionar o vídeo para assistir mais tarde')
        }
      });
    } else {
      this.videoService.removeFromWatchLater(videoId.toString(), this.userId.toString()).subscribe({
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

  checkWatchLater(){
    this.unbTvVideos.forEach(video=>{
      if(video.id)
        this.checkWatchLaterStatus(video.id);
    })
  }

  checkWatchLaterStatus(videoId: number): void {
    this.videoService.checkWatchLater(videoId.toString(), this.userId.toString()).subscribe({
      next: (response) => {
        this.isWatchLater = response.status; // Acessa a propriedade status do objeto response
        let index = this.unbTvVideos.findIndex(video=>video.id==videoId);
        this.unbTvVideos[index].isWatchLater = response.status;
      },
      error: (err) => {
        console.error('Error checking watch later status', err);
      }
    });
  }

  showWatchLaterMessage(isWatchLater: boolean): void {
    const message = isWatchLater ? 'Vídeo salvo a lista!' : 'Vídeo removido da lista!';
    this.favoriteMessage = message;  // Armazena a mensagem na variável
    alert(message);  // Exemplo de alert, mas você pode customizar com mensagens na tela
  }


  // Método para alternar o estado do menu (já existente)
  toggleMenu(video: IVideo, event: Event): void {
    // Fecha outros menus ao abrir o atual
    this.unbTvVideos.forEach(v => {
      if (v !== video) {
        v.showMenu = false;
      }
    });

    // Alterna o estado do menu do vídeo atual
    video.showMenu = !video.showMenu;

    // Asserção de tipo
    const videoElement = (event.target as HTMLElement).closest('.video-thumbnail-container');

    if (videoElement) {
      videoElement.classList.toggle('video-hovered');
    }
  }

  // Método para fechar o menu ao clicar fora
  @HostListener('document:click', ['$event'])
  closeMenu(event: Event): void {
    const target = event.target as HTMLElement; // Asserção de tipo

    // Verifica se o clique ocorreu dentro do menu ou do botão
    const clickedInside = target?.closest('.video-thumbnail-container') || target?.closest('.menu-icon-container');
    
    if (!clickedInside) {
      this.unbTvVideos.forEach(video => {
        video.showMenu = false; // Fecha todos os menus
      });
    }
  }
  
  handleOptionSelection(video: IVideo, option: string): void {
    // Fecha o menu assim que a opção é selecionada
    video.showMenu = false;
  
    if (option === 'favorite') {
      this.toggleFavorite(video);
    } else if (option === 'watch-later') {
      this.toggleWatchLater(video);
    }
  }
  
  returnToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
  // Função que retorna a URL do vídeo
  getVideoUrl(): string {
    return `${this.eduplayVideoUrl}${this.idVideo}`;
  }
}
