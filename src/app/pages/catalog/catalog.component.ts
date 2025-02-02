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
   // Definindo o número inicial de thumbnails visíveis
   thumbnailsVisibleCount = 4;
   
   videoCatalog: {
    [key: string]: { title: string; imageUrl: string }[];
    } = {
      journalism: [
        { title: 'Fala, jovem', imageUrl: '../../../assets/imgs/catalog-thumbs/1.Fala-Jovem.jpg' },
        { title: 'Informe UnB', imageUrl: '../../../assets/imgs/catalog-thumbs/2.Informe-UnB.jpg' },
        { title: 'Zapping', imageUrl: '../../../assets/imgs/catalog-thumbs/3.Zapping.jpg' },
      ],
      interviews: [
      { title: 'Brasil em Questão', imageUrl: '../../../assets/imgs/catalog-thumbs/4.Brasil-em-Questao.jpg' },
      { title: 'Diálogos', imageUrl: '../../../assets/imgs/catalog-thumbs/5.Diálogos.jpg' },
      { title: 'Tirando de Letra', imageUrl: '../../../assets/imgs/catalog-thumbs/6.Tirando-de-Letra.jpg' },
      { title: 'UnBTV Entrevista', imageUrl: '../../../assets/imgs/catalog-thumbs/7.UnBTV-Entrevista.jpg' },
      { title: 'Vasto Mundo', imageUrl: '../../../assets/imgs/catalog-thumbs/8.Vasto-Mundo.jpg' },
      { title: 'Vozes Diplomáticas', imageUrl: '../../../assets/imgs/catalog-thumbs/9.Vozes-Diplomaticas.jpg' }
    ]
  };

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
      const matchesTitle = this.filterTitle ? video.title?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      const matchesDescription = this.filterTitle ? video.description?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      const matchesKeywords = this.filterTitle ? video.keywords?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;
      const matchesCatalog = this.filterTitle ? video.catalog?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true;

      return (matchesTitle || matchesDescription || matchesKeywords || matchesCatalog);
    });
  }

  onProgramClick(videos: IVideo[]) {
    this.videoService.setVideosCatalog(videos);
    this.router.navigate(['/videos']);
  }

  dummyKeyDown(event: KeyboardEvent): void {
    // Não faz nada
  }

   // Método para controlar a exibição das thumbnails
  scrollThumbnails(categoryKey: string, direction: string): void {
    const maxThumbnails = this.videoCatalog[categoryKey].length; // Total de thumbnails dessa categoria

    // Se for para a direita
    if (direction === 'right' && this.thumbnailsVisibleCount < maxThumbnails) {
      this.thumbnailsVisibleCount += 4; // Adiciona mais 4 thumbnails visíveis
    }
    // Se for para a esquerda
    else if (direction === 'left' && this.thumbnailsVisibleCount > 4) {
      this.thumbnailsVisibleCount -= 4; // Remove 4 thumbnails visíveis
    }
  }
}