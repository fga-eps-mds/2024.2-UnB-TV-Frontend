
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
  thumbnailsVisible: { [key: string]: number } = {};
  sliderStates: { [section: string]: number } = {};


  videoCatalog: {
    [key: string]: { title: string; imageUrl: string }[];
  } = {
      interviews: [
        { title: 'Brasil em Questão', imageUrl: '../../../assets/imgs/catalog-thumbs/4.Brasil-em-Questao.jpg' },
        { title: 'Diálogos', imageUrl: '../../../assets/imgs/catalog-thumbs/5.Diálogos.jpg' },
        { title: 'Tirando de Letra', imageUrl: '../../../assets/imgs/catalog-thumbs/6.Tirando-de-Letra.jpg' },
        { title: 'UnBTV Entrevista', imageUrl: '../../../assets/imgs/catalog-thumbs/7.UnBTV-Entrevista.jpg' },
        { title: 'Vasto Mundo', imageUrl: '../../../assets/imgs/catalog-thumbs/8.Vasto-Mundo.jpg' },
        { title: 'Vozes Diplomáticas', imageUrl: '../../../assets/imgs/catalog-thumbs/9.Vozes-Diplomaticas.jpg' }
      ],
      researchAndScience: [
        { title: 'Explique sua Tese', imageUrl: '../../../assets/imgs/catalog-thumbs/10.Explique-sua-Tese.jpg' },
        { title: 'Fazendo Ciência Formando Cientistas', imageUrl: '../../../assets/imgs/catalog-thumbs/11.Fazendo-Ciencia-Formando-Cientistas.jpg' },
        { title: 'Radar da Extensão', imageUrl: '../../../assets/imgs/catalog-thumbs/12.Radar-da-Extensao.jpg' },
        { title: 'Se Liga no PAS', imageUrl: '../../../assets/imgs/catalog-thumbs/13.Se-Liga-no-PAS.jpg' },
        { title: 'UnBTV Ciência', imageUrl: '../../../assets/imgs/catalog-thumbs/14.UnBTV-Ciencia.png' },
        { title: 'Universidade Para Quê?', imageUrl: '../../../assets/imgs/catalog-thumbs/15.Universidade-Para-Que.jpg' }
      ],
      specialSeries: [
        { title: 'Floresta de Gente', imageUrl: '../../../assets/imgs/catalog-thumbs/20.Floresta-de-Gente.jpg' },
        { title: 'Guia do Calouro', imageUrl: '../../../assets/imgs/catalog-thumbs/21.Guia-do-Calouro.jpg' },
        { title: 'Memórias de Paulo Freire', imageUrl: '../../../assets/imgs/catalog-thumbs/22.Memorias-de-Paulo-Freire.jpg' },
        { title: 'Os desafios das eleições 2022', imageUrl: '../../../assets/imgs/catalog-thumbs/23.Os-desafios-das-eleicoes2022.jpg' },
        { title: 'Podcast Vida de Estudante', imageUrl: '../../../assets/imgs/catalog-thumbs/24.Podcast-Vida-de-Estudante.jpg' },
        { title: 'Série Arquitetura', imageUrl: '../../../assets/imgs/catalog-thumbs/25.Serie-Arquitetura.jpg' }
      ]
    };

  constructor(
    private videoService: VideoService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      this.setUserIdFromToken(localStorage.getItem('token') as string);
      this.getUserDetails();
    }
    this.findAll();
    // Para cada categoria, inicializa com 4 thumbnails visíveis
    console.log('videoCatalog:', this.videoCatalog);

    // Supondo que você tenha várias seções: 'interviews', 'researchAndScience', 'specialSeries', etc.
    this.sliderStates['interviews'] = 4;
    this.sliderStates['researchAndScience'] = 4;
    this.sliderStates['specialSeries'] = 4;
  }

  getMaxThumbnailsForSection(sectionKey: string): number {
    return this.videoCatalog[sectionKey].length;
  }


  setUserIdFromToken(token: string | null) {
    if (!token) {
      console.error('Token inválido');
      return;
    }
    try {
      const decodedToken: any = jwt_decode(token);
      this.userId = decodedToken.id;
    } catch (error) {
      console.error('Erro ao decodificar token:', error);
    }
  }

  getUserDetails() {
    if (!this.userId) {
      console.error('Erro: userId está indefinido');
      return;
    }
    console.log('Buscando detalhes do usuário para:', this.userId);
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (err) => {
        console.error('Erro ao buscar detalhes do usuário', err);
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
  scrollThumbnails(sectionKey: string, direction: string): void {
    // Suponha que você tenha um método para obter a quantidade máxima de thumbnails para a seção
    const maxThumbnails = this.getMaxThumbnailsForSection(sectionKey);

    if (direction === 'right' && this.sliderStates[sectionKey] < maxThumbnails) {
      this.sliderStates[sectionKey] += 4;
    } else if (direction === 'left' && this.sliderStates[sectionKey] > 4) {

      this.sliderStates[sectionKey] -= 4;
    }
  }
}
