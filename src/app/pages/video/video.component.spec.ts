import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { VideoComponent } from './video.component';
import { VideoService } from '../../services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

const mockData: IVideo[] = [
  {
    id: 190985,
    title: 'Esboços: Luiz Gallina',
    description:
      '<p><br /></p><p><span style="color:rgb( 19 , 19 , 19 )">A curiosidade de Luiz Gallina em descobrir e entender como mecanismos e processos funcionam dá origem a uma obra composta por gravuras, pinturas e esculturas - abordando temas tão diversos quanto as árvores da paisagem de Brasília, a alquimia e os sonhos colecionados de forma escrita pelo artista durante anos.</span></p><p><br /><br /></p>',
    keywords: 'Esboços; Luiz Gallina; UnBTV;',
    visibility: 'PUBLIC',
    duration: 1527827,
    embed:
      '<iframe width="671" height="377" src="https://eduplay.rnp.br/portal/video/embed/190985" frameborder="0" scrolling="no" allowfullscreen></iframe>',
    generateLibras: true,
    generateSubtitle: true,
    qtAccess: 20,
    qtLikes: 0,
    images: [
      {
        type: 'DEFAULT',
        href: 'https://eduplay.rnp.br/portal/assets/videos/images/1699445118833.jpg',
      },
    ],
    channels: [
      {
        id: 190265,
        name: 'UnBTV',
      },
    ],
    isFavorited: false,
    isWatchLater: false,
  },
  {
    id: 190984,
    title: 'Esboços: Ricardo Caldeira',
    description:
      '<p><br /></p><p><span style="color:rgb( 19 , 19 , 19 )">Quando Ricardo Caldeira desenha parece dançar imprimindo na tela um traço marcante que fala sobre afeto, negritude, ancestralidade. Aqui o artista relembra sua infância e adolescência, os primeiros trabalhos e a relação com a região de São Sebastião, local que o influenciou e que hoje ele transforma por meio da participação em coletivos culturais.</span></p><p><br /></p><p><br /></p>',
    keywords: 'Esboços; Ricardo Caldeira; UnBTV;',
    visibility: 'PUBLIC',
    duration: 1525621,
    embed:
      '<iframe width="671" height="377" src="https://eduplay.rnp.br/portal/video/embed/190984" frameborder="0" scrolling="no" allowfullscreen></iframe>',
    generateLibras: true,
    generateSubtitle: true,
    qtAccess: 14,
    qtLikes: 0,
    images: [
      {
        type: 'DEFAULT',
        href: 'https://eduplay.rnp.br/portal/assets/videos/images/1699445004278.jpg',
      },
    ],
    channels: [
      {
        id: 190265,
        name: 'UnBTV',
      },
    ],
    isFavorited: false,
    isWatchLater: false,
  },
  {
    id: 190334,
    title: 'Esboços | Fernanda Pacca',
    description:
      '<p><br /></p><p style="text-align:justify"><span style="background-color:hsl( 0 , 0% , 100% );color:rgb( 19 , 19 , 19 )">Confetes, braçadeiras de náilon, botões, linhas de costuras compõe a palheta de cores que constroem surpreendentes figuras humanas na obra de Fernanda Pacca. Trabalhos que impressionam pela forma e abordam diversos temas como o fascínio pelo anatomia, a repressão - tanto estética quanto social - e a violência contra a mulher. </span></p><p><br /><br /><br /><br /></p>',
    keywords: 'Fernanda Pacca; Esboços; unbtv;',
    visibility: 'PUBLIC',
    duration: 1550174,
    embed:
      '<iframe width="671" height="377" src="https://eduplay.rnp.br/portal/video/embed/190334" frameborder="0" scrolling="no" allowfullscreen></iframe>',
    generateLibras: true,
    generateSubtitle: true,
    qtAccess: 15,
    qtLikes: 0,
    images: [
      {
        type: 'DEFAULT',
        href: 'https://eduplay.rnp.br/portal/assets/videos/images/1698243181940.jpg',
      },
    ],
    channels: [
      {
        id: 190265,
        name: 'UnBTV',
      },
    ],
    isFavorited: false,
    isWatchLater: false,
  },
  {
    id: 190333,
    title: 'Esboços | Valéria Pena-Costa',
    description:
      '<p><br /></p><p style="text-align:justify"><span style="background-color:hsl( 0 , 0% , 100% );color:rgb( 19 , 19 , 19 )">Poeira, insetos, objetos em deterioração são, ao mesmo tempo, tema e matéria-prima para a obra de Valéria Pena-Costa em um trabalho que reflete a inevitável passagem do tempo, as memórias de infância, os medos passados e presentes em diferentes formas de expressão.</span></p><p><br /></p>',
    keywords: 'Valéria Pena-Costa; Esboços; unbtv;',
    visibility: 'PUBLIC',
    duration: 1547193,
    embed:
      '<iframe width="671" height="377" src="https://eduplay.rnp.br/portal/video/embed/190333" frameborder="0" scrolling="no" allowfullscreen></iframe>',
    generateLibras: true,
    generateSubtitle: true,
    qtAccess: 23,
    qtLikes: 0,
    images: [
      {
        type: 'DEFAULT',
        href: 'https://eduplay.rnp.br/portal/assets/videos/images/1698243362095.jpg',
      },
    ],
    channels: [
      {
        id: 190265,
        name: 'UnBTV',
      },
    ],
    isFavorited: false,
    isWatchLater: false,
  },
  {
    id: 190324,
    title: 'Esboços: TNHA',
    description:
      '<p><br /></p><p><span style="background-color:hsl( 0 , 0% , 100% );color:rgb( 19 , 19 , 19 )">A busca por uma identidade que integre raízes negras, indígenas e latino-americanas cria uma obra que resgata ancestralidade, de olho sempre nas injustiças históricas. Seja espalhando rostos em grafites pelo Distrito Federal para suavizar o caminho de todo dia; seja tatuando ou fazendo ilustrações, TNHA tem um traço singular que carrega todo um aprendizado de andanças por diferentes comunidades e vivências familiares. </span></p><p><span style="background-color:hsl( 0 , 0% , 100% );color:rgb( 19 , 19 , 19 )"><br /></span></p>',
    keywords: 'esboços; Tnha; unbtv;',
    visibility: 'PUBLIC',
    duration: 1550383,
    embed:
      '<iframe width="671" height="377" src="https://eduplay.rnp.br/portal/video/embed/190324" frameborder="0" scrolling="no" allowfullscreen></iframe>',
    generateLibras: true,
    generateSubtitle: true,
    qtAccess: 14,
    qtLikes: 0,
    images: [
      {
        type: 'DEFAULT',
        href: 'https://eduplay.rnp.br/portal/assets/videos/images/1698146507222.jpg',
      },
    ],
    channels: [
      {
        id: 190265,
        name: 'UnBTV',
      },
    ],
    isFavorited: false,
    isWatchLater: false,
  },
];

class VideoServiceMock {
  getVideosCatalog() {
    return of(mockData);
  }

  addToFavorite(videoId: string, userId: string) {
    return of({});
  }

  removeFromFavorite(videoId: string, userId: string) {
    return of({});
  }

  checkFavorite(videoId: string, userId: string) {
    {
      return of({ statusFavorite: true });
    }
  }

  addToWatchLater(videoId: string, userId: string) {
    return of({});
  }

  removeFromWatchLater(videoId: string, userId: string) {
    return of({});
  }

  checkWatchLater(videoId: string, userId: string) {
    return of({ status: true });
  }
}

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;
  let videoService: VideoService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: VideoService, useClass: VideoServiceMock },
        MessageService,
        AuthService,
        UserService,
        AlertService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    videoService = TestBed.inject(VideoService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getVideos ', () => {
    spyOn(component, 'getVideos');
    fixture.detectChanges();
    expect(component.getVideos).toHaveBeenCalled();
  });

  it('should call getVideos and return a list of videos', () => {
    const mySpy = spyOn(component, 'getVideos').and.callThrough();
    component.getVideos();
    expect(mySpy).toHaveBeenCalled();
    expect(component.unbTvVideos).toEqual(mockData);
  });

  it('should call getVideos and return an error', () => {
    const mySpy = spyOn(videoService, 'getVideosCatalog').and.returnValue(
      throwError(() => new Error('Erro'))
    );
    component.getVideos();
    expect(component.unbTvVideos).toEqual([]);
    expect(mySpy).toHaveBeenCalled();
  });

  it('should call returnToCatalog when the button is clicked', () => {
    const navigateSpy = spyOn(router, 'navigate');
    component.returnToCatalog();
    expect(navigateSpy).toHaveBeenCalledWith(['/catalog']);
  });

  it('should call getVideos on ngOnInit', () => {
    spyOn(component, 'getVideos');
    component.ngOnInit();
    expect(component.getVideos).toHaveBeenCalled();
  });

  it('should set isDesktop based on window width on ngOnInit', () => {
    spyOnProperty(window, 'innerWidth').and.returnValue(1024);
    component.ngOnInit();
    expect(component.isDesktop).toBeTrue();
  });

  it('should set iframe src if iframe and idVideo are present on ngOnInit', () => {
    component.idVideo = 12345;
    const iframe = document.createElement('iframe');
    iframe.id = 'embeddedVideo';
    document.body.appendChild(iframe);
    component.ngOnInit();
    expect(iframe.src).toBe(`${component.eduplayVideoUrl}${component.idVideo}`);
    document.body.removeChild(iframe);
  });

  it('should call setUserIdFromToken and getUserDetails if authenticated on ngOnInit', () => {
    spyOn(component.authService, 'isAuthenticated').and.returnValue(true);
    spyOn(component, 'setUserIdFromToken');
    spyOn(component, 'getUserDetails');
    spyOn(localStorage, 'getItem').and.returnValue('mockToken');
    component.ngOnInit();
    expect(component.setUserIdFromToken).toHaveBeenCalledWith('mockToken');
    expect(component.getUserDetails).toHaveBeenCalled();
  });

  it('should not call setUserIdFromToken and getUserDetails if not authenticated on ngOnInit', () => {
    spyOn(component.authService, 'isAuthenticated').and.returnValue(false);
    spyOn(component, 'setUserIdFromToken');
    spyOn(component, 'getUserDetails');
    component.ngOnInit();
    expect(component.setUserIdFromToken).not.toHaveBeenCalled();
    expect(component.getUserDetails).not.toHaveBeenCalled();
  });

  it('should call getUserDetails and set user details correctly', () => {
    const mockUser = { id: '123', name: 'John Doe' };
    spyOn(component.userService, 'getUser').and.returnValue(of(mockUser));
    spyOn(component, 'checkFavorites');
    spyOn(component, 'checkWatchLater');

    component.getUserDetails();

    expect(component.userService.getUser).toHaveBeenCalledWith(
      component.userId
    );
    expect(component.user).toEqual(mockUser);
    expect(component.checkFavorites).toHaveBeenCalled();
    expect(component.checkWatchLater).toHaveBeenCalled();
  });

  it('should handle error when getUserDetails fails', () => {
    const consoleSpy = spyOn(console, 'error');
    spyOn(component.userService, 'getUser').and.returnValue(
      throwError(() => new Error('Error fetching user details'))
    );

    component.getUserDetails();

    expect(component.userService.getUser).toHaveBeenCalledWith(
      component.userId
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching user details',
      jasmine.any(Error)
    );
  });

  it('should toggle favorite status and call addToFavorite when video is not favorited', () => {
    const video: IVideo = { id: 1, isFavorited: false } as IVideo;
    spyOn(component.videoService, 'addToFavorite').and.returnValue(of({}));
    spyOn(component.alertService, 'showMessage');

    component.toggleFavorite(video);

    expect(video.isFavorited).toBeTrue();
    expect(component.videoService.addToFavorite).toHaveBeenCalledWith(
      '1',
      component.userId
    );
    expect(component.alertService.showMessage).toHaveBeenCalledWith(
      'success',
      'Sucesso',
      'Vídeo adicionado à lista de Favoritos'
    );
  });

  it('should toggle favorite status and call removeFromFavorite when video is favorited', () => {
    const video: IVideo = { id: 1, isFavorited: true } as IVideo;
    spyOn(component.videoService, 'removeFromFavorite').and.returnValue(of({}));
    spyOn(component.alertService, 'showMessage');

    component.toggleFavorite(video);

    expect(video.isFavorited).toBeFalse();
    expect(component.videoService.removeFromFavorite).toHaveBeenCalledWith(
      '1',
      component.userId
    );
    expect(component.alertService.showMessage).toHaveBeenCalledWith(
      'success',
      'Sucesso',
      'Vídeo removido da lista de Favoritos'
    );
  });

  it('should handle error when adding to favorite fails', () => {
    const video: IVideo = { id: 1, isFavorited: false } as IVideo;
    spyOn(component.videoService, 'addToFavorite').and.returnValue(
      throwError(() => new Error('Error'))
    );
    spyOn(component.alertService, 'showMessage');
    spyOn(console, 'error');

    component.toggleFavorite(video);

    expect(video.isFavorited).toBeTrue();
    expect(component.videoService.addToFavorite).toHaveBeenCalledWith(
      '1',
      component.userId
    );
    expect(component.alertService.showMessage).toHaveBeenCalledWith(
      'error',
      'Erro',
      'Erro ao adicionar o vídeo para lista de favoritos'
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error adding to favorite',
      jasmine.any(Error)
    );
  });

  it('should handle error when removing from favorite fails', () => {
    const video: IVideo = { id: 1, isFavorited: true } as IVideo;
    spyOn(component.videoService, 'removeFromFavorite').and.returnValue(
      throwError(() => new Error('Error'))
    );
    spyOn(component.alertService, 'showMessage');
    spyOn(console, 'error');

    component.toggleFavorite(video);

    expect(video.isFavorited).toBeFalse();
    expect(component.videoService.removeFromFavorite).toHaveBeenCalledWith(
      '1',
      component.userId
    );
    expect(component.alertService.showMessage).toHaveBeenCalledWith(
      'error',
      'Erro',
      'Erro ao remover o vídeo da lista de favoritos'
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error removing from favorite',
      jasmine.any(Error)
    );
  });

  it('should call checkFavoriteStatus and set isFavorited correctly', () => {
    const videoId = 1;
    const response = { statusfavorite: true };
    spyOn(component.videoService, 'checkFavorite').and.returnValue(
      of(response)
    );
    spyOn(component.unbTvVideos, 'findIndex').and.returnValue(0);

    component.unbTvVideos[0] = {
      ...component.unbTvVideos[0],
      isFavorited: false,
    }; // Ensure the video object exists

    component.checkFavoriteStatus(videoId);

    expect(component.videoService.checkFavorite).toHaveBeenCalledWith(
      videoId.toString(),
      component.userId.toString()
    );
    expect(component.isFavorite).toBeTrue();
    expect(component.unbTvVideos[0].isFavorited).toBeTrue();
  });

  it('should handle error when checkFavoriteStatus fails', () => {
    const videoId = 1;
    const consoleSpy = spyOn(console, 'error');
    spyOn(component.videoService, 'checkFavorite').and.returnValue(
      throwError(() => new Error('Error checking favorite status'))
    );

    component.checkFavoriteStatus(videoId);

    expect(component.videoService.checkFavorite).toHaveBeenCalledWith(
      videoId.toString(),
      component.userId.toString()
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error checking favorite status',
      jasmine.any(Error)
    );
  });

  it('should call checkFavorites and checkFavoriteStatus for each video', () => {
    const videos = [
      { id: 1, isFavorited: false },
      { id: 2, isFavorited: false },
    ] as IVideo[];
    component.unbTvVideos = videos;
    spyOn(component, 'checkFavoriteStatus');

    component.checkFavorites();

    expect(component.checkFavoriteStatus).toHaveBeenCalledWith(1);
    expect(component.checkFavoriteStatus).toHaveBeenCalledWith(2);
  });

  it('should not call checkFavoriteStatus if video id is undefined', () => {
    const videos = [
      { id: undefined, isFavorited: false },
      { id: 2, isFavorited: false },
    ] as IVideo[];
    component.unbTvVideos = videos;
    spyOn(component, 'checkFavoriteStatus');

    component.checkFavorites();

    expect(component.checkFavoriteStatus).toHaveBeenCalledWith(2);
    expect(component.checkFavoriteStatus).not.toHaveBeenCalledWith(
      undefined as any
    );
  });

  it('should set favoriteMessage and show alert with "Vídeo favoritado!" when isFavorite is true', () => {
    spyOn(window, 'alert');
    component.showFavoriteMessage(true);
    expect(component.favoriteMessage).toBe('Vídeo favoritado!');
    expect(window.alert).toHaveBeenCalledWith('Vídeo favoritado!');
  });

  it('should set favoriteMessage and show alert with "Vídeo desfavoritado!" when isFavorite is false', () => {
    spyOn(window, 'alert');
    component.showFavoriteMessage(false);
    expect(component.favoriteMessage).toBe('Vídeo desfavoritado!');
    expect(window.alert).toHaveBeenCalledWith('Vídeo desfavoritado!');
  });

  it('should toggle watch later status and call addToWatchLater when video is not in watch later list', () => {
    const video: IVideo = { id: 1, isWatchLater: false } as IVideo;
    spyOn(component.videoService, 'addToWatchLater').and.returnValue(of({}));
    spyOn(component.alertService, 'showMessage');

    component.toggleWatchLater(video);

    expect(video.isWatchLater).toBeTrue();
    expect(component.videoService.addToWatchLater).toHaveBeenCalledWith(
      '1',
      component.userId
    );
    expect(component.alertService.showMessage).toHaveBeenCalledWith(
      'success',
      'Sucesso',
      'Vídeo adicionado à lista de Assistir Mais tarde'
    );
  });

  it('should toggle watch later status and call removeFromWatchLater when video is in watch later list', () => {
    const video: IVideo = { id: 1, isWatchLater: true } as IVideo;
    spyOn(component.videoService, 'removeFromWatchLater').and.returnValue(
      of({})
    );
    spyOn(component.alertService, 'showMessage');

    component.toggleWatchLater(video);

    expect(video.isWatchLater).toBeFalse();
    expect(component.videoService.removeFromWatchLater).toHaveBeenCalledWith(
      '1',
      component.userId
    );
    expect(component.alertService.showMessage).toHaveBeenCalledWith(
      'success',
      'Sucesso',
      'Vídeo removido da lista de Assistir mais tarde.'
    );
  });

  it('should handle error when adding to watch later fails', () => {
    const video: IVideo = { id: 1, isWatchLater: false } as IVideo;
    spyOn(component.videoService, 'addToWatchLater').and.returnValue(
      throwError(() => new Error('Error'))
    );
    spyOn(component.alertService, 'showMessage');
    spyOn(console, 'error');

    component.toggleWatchLater(video);

    expect(video.isWatchLater).toBeTrue();
    expect(component.videoService.addToWatchLater).toHaveBeenCalledWith(
      '1',
      component.userId
    );
    expect(component.alertService.showMessage).toHaveBeenCalledWith(
      'error',
      'Erro',
      'Erro ao adicionar o vídeo para assistir mais tarde'
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error adding to watch later',
      jasmine.any(Error)
    );
  });

  it('should handle error when removing from watch later fails', () => {
    const video: IVideo = { id: 1, isWatchLater: true } as IVideo;
    spyOn(component.videoService, 'removeFromWatchLater').and.returnValue(
      throwError(() => new Error('Error'))
    );
    spyOn(component.alertService, 'showMessage');
    spyOn(console, 'error');

    component.toggleWatchLater(video);

    expect(video.isWatchLater).toBeFalse();
    expect(component.videoService.removeFromWatchLater).toHaveBeenCalledWith(
      '1',
      component.userId
    );
    expect(component.alertService.showMessage).toHaveBeenCalledWith(
      'error',
      'Erro',
      'Erro ao remover o vídeo da lista de assistir mais tarde'
    );
    expect(console.error).toHaveBeenCalledWith(
      'Error removing from watch later',
      jasmine.any(Error)
    );
  });

  it('should call checkWatchLaterStatus and set isWatchLater correctly', () => {
    const videoId = 1;
    const response = { status: true };
    spyOn(component.videoService, 'checkWatchLater').and.returnValue(
      of(response)
    );
    spyOn(component.unbTvVideos, 'findIndex').and.returnValue(0);

    component.unbTvVideos[0] = {
      ...component.unbTvVideos[0],
      isWatchLater: false,
    }; // Ensure the video object exists

    component.checkWatchLaterStatus(videoId);

    expect(component.videoService.checkWatchLater).toHaveBeenCalledWith(
      videoId.toString(),
      component.userId.toString()
    );
    expect(component.isWatchLater).toBeTrue();
    expect(component.unbTvVideos[0].isWatchLater).toBeTrue();
  });

  it('should handle error when checkWatchLaterStatus fails', () => {
    const videoId = 1;
    const consoleSpy = spyOn(console, 'error');
    spyOn(component.videoService, 'checkWatchLater').and.returnValue(
      throwError(() => new Error('Error checking watch later status'))
    );

    component.checkWatchLaterStatus(videoId);

    expect(component.videoService.checkWatchLater).toHaveBeenCalledWith(
      videoId.toString(),
      component.userId.toString()
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error checking watch later status',
      jasmine.any(Error)
    );
  });

  it('should call checkWatchLater and checkWatchLaterStatus for each video', () => {
    const videos = [
      { id: 1, isWatchLater: false },
      { id: 2, isWatchLater: false },
    ] as IVideo[];
    component.unbTvVideos = videos;
    spyOn(component, 'checkWatchLaterStatus');

    component.checkWatchLater();

    expect(component.checkWatchLaterStatus).toHaveBeenCalledWith(1);
    expect(component.checkWatchLaterStatus).toHaveBeenCalledWith(2);
  });

  it('should not call checkWatchLaterStatus if video id is undefined', () => {
    const videos = [
      { id: undefined, isWatchLater: false },
      { id: 2, isWatchLater: false },
    ] as IVideo[];
    component.unbTvVideos = videos;
    spyOn(component, 'checkWatchLaterStatus');

    component.checkWatchLater();

    expect(component.checkWatchLaterStatus).toHaveBeenCalledWith(2);
    expect(component.checkWatchLaterStatus).not.toHaveBeenCalledWith(
      undefined as any
    );
  });

  it('should call checkWatchLaterStatus and set isWatchLater correctly', () => {
    const videoId = 190985;
    const response = { status: true };
    spyOn(component.videoService, 'checkWatchLater').and.returnValue(
      of(response)
    );
    spyOn(component.unbTvVideos, 'findIndex').and.returnValue(0);

    component.unbTvVideos[0] = {
      ...component.unbTvVideos[0],
      isWatchLater: false,
    }; // Ensure the video object exists

    component.checkWatchLaterStatus(videoId);

    expect(component.videoService.checkWatchLater).toHaveBeenCalledWith(
      videoId.toString(),
      component.userId.toString()
    );
    expect(component.isWatchLater).toBeTrue();
    expect(component.unbTvVideos[0].isWatchLater).toBeTrue();
  });

  it('should handle error when checkWatchLaterStatus fails', () => {
    const videoId = 190985;
    const consoleSpy = spyOn(console, 'error');
    spyOn(component.videoService, 'checkWatchLater').and.returnValue(
      throwError(() => new Error('Error checking watch later status'))
    );

    component.checkWatchLaterStatus(videoId);

    expect(component.videoService.checkWatchLater).toHaveBeenCalledWith(
      videoId.toString(),
      component.userId.toString()
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error checking watch later status',
      jasmine.any(Error)
    );
  });

  it('should set watchLaterMessage and show alert with "Vídeo salvo a lista!" when isWatchLater is true', () => {
    spyOn(window, 'alert');
    component.showWatchLaterMessage(true);
    expect(component.favoriteMessage).toBe('Vídeo salvo a lista!');
    expect(window.alert).toHaveBeenCalledWith('Vídeo salvo a lista!');
  });

  it('should set watchLaterMessage and show alert with "Vídeo removido da lista!" when isWatchLater is false', () => {
    spyOn(window, 'alert');
    component.showWatchLaterMessage(false);
    expect(component.favoriteMessage).toBe('Vídeo removido da lista!');
    expect(window.alert).toHaveBeenCalledWith('Vídeo removido da lista!');
  });

  it('should toggle menu state and close other menus', () => {
    const video: IVideo = { id: 1, showMenu: false } as IVideo;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    const target = document.createElement('div');
    Object.defineProperty(event, 'target', { value: target });

    component.unbTvVideos = [
      { id: 1, showMenu: false } as IVideo,
      { id: 2, showMenu: true } as IVideo,
    ];

    component.toggleMenu(video, event);

    expect(component.unbTvVideos[0].showMenu).toBeFalse();
    expect(component.unbTvVideos[1].showMenu).toBeFalse();
  });

  it('should close all menus when clicking outside', () => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    const target = document.createElement('div');
    Object.defineProperty(event, 'target', { value: target });

    component.unbTvVideos = [
      { id: 1, showMenu: true } as IVideo,
      { id: 2, showMenu: true } as IVideo,
    ];

    component.closeMenu(event);

    expect(component.unbTvVideos[0].showMenu).toBeFalse();
    expect(component.unbTvVideos[1].showMenu).toBeFalse();
  });

  it('should not close menus when clicking inside', () => {
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    const target = document.createElement('div');
    target.classList.add('video-thumbnail-container');
    Object.defineProperty(event, 'target', { value: target });

    component.unbTvVideos = [
      { id: 1, showMenu: true } as IVideo,
      { id: 2, showMenu: true } as IVideo,
    ];

    component.closeMenu(event);

    expect(component.unbTvVideos[0].showMenu).toBeTrue();
    expect(component.unbTvVideos[1].showMenu).toBeTrue();
  });

  it('should call toggleFavorite when option is "favorite"', () => {
    const video: IVideo = { id: 1, showMenu: true } as IVideo;
    spyOn(component, 'toggleFavorite');

    component.handleOptionSelection(video, 'favorite');

    expect(video.showMenu).toBeFalse();
    expect(component.toggleFavorite).toHaveBeenCalledWith(video);
  });

  it('should call toggleWatchLater when option is "watch-later"', () => {
    const video: IVideo = { id: 1, showMenu: true } as IVideo;
    spyOn(component, 'toggleWatchLater');

    component.handleOptionSelection(video, 'watch-later');

    expect(video.showMenu).toBeFalse();
    expect(component.toggleWatchLater).toHaveBeenCalledWith(video);
  });

  it('should not call any method when option is unknown', () => {
    const video: IVideo = { id: 1, showMenu: true } as IVideo;
    spyOn(component, 'toggleFavorite');
    spyOn(component, 'toggleWatchLater');

    component.handleOptionSelection(video, 'unknown-option');

    expect(video.showMenu).toBeFalse();
    expect(component.toggleFavorite).not.toHaveBeenCalled();
    expect(component.toggleWatchLater).not.toHaveBeenCalled();
  });
  it('should call toggleFavorite when option is "favorite"', () => {
    const video: IVideo = { id: 1, showMenu: true } as IVideo;
    spyOn(component, 'toggleFavorite');

    component.handleOptionSelection(video, 'favorite');

    expect(video.showMenu).toBeFalse();
    expect(component.toggleFavorite).toHaveBeenCalledWith(video);
  });

  it('should call toggleWatchLater when option is "watch-later"', () => {
    const video: IVideo = { id: 1, showMenu: true } as IVideo;
    spyOn(component, 'toggleWatchLater');

    component.handleOptionSelection(video, 'watch-later');

    expect(video.showMenu).toBeFalse();
    expect(component.toggleWatchLater).toHaveBeenCalledWith(video);
  });

  it('should not call any method when option is unknown', () => {
    const video: IVideo = { id: 1, showMenu: true } as IVideo;
    spyOn(component, 'toggleFavorite');
    spyOn(component, 'toggleWatchLater');

    component.handleOptionSelection(video, 'unknown-option');

    expect(video.showMenu).toBeFalse();
    expect(component.toggleFavorite).not.toHaveBeenCalled();
    expect(component.toggleWatchLater).not.toHaveBeenCalled();
  });

  it('should toggle the "video-hovered" class on the video element', () => {
    const video: IVideo = { id: 1, showMenu: false } as IVideo;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    const target = document.createElement('div');
    target.classList.add('video-thumbnail-container');
    Object.defineProperty(event, 'target', { value: target });

    document.body.appendChild(target);

    component.toggleMenu(video, event);

    expect(target.classList.contains('video-hovered')).toBeTrue();

    component.toggleMenu(video, event);

    expect(target.classList.contains('video-hovered')).toBeFalse();

    document.body.removeChild(target);
  });

  it('should not toggle the "video-hovered" class if video element is not found', () => {
    const video: IVideo = { id: 1, showMenu: false } as IVideo;
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    const target = document.createElement('div');
    Object.defineProperty(event, 'target', { value: target });

    spyOn(target, 'closest').and.returnValue(null);

    component.toggleMenu(video, event);

    expect(target.classList.contains('video-hovered')).toBeFalse();
  });
  it('should return the correct video URL', () => {
    component.idVideo = 12345;
    const expectedUrl = `${component.eduplayVideoUrl}${component.idVideo}`;
    expect(component.getVideoUrl()).toBe(expectedUrl);
  });

  it('should return an empty URL if idVideo is not set', () => {
    component.idVideo = undefined as any;
    const expectedUrl = `${component.eduplayVideoUrl}${component.idVideo}`;
    expect(component.getVideoUrl()).toBe(expectedUrl);
  });

  it('should return the correct URL when eduplayVideoUrl is changed', () => {
    component.eduplayVideoUrl = 'https://newurl.com/video/';
    component.idVideo = 67890;
    const expectedUrl = `${component.eduplayVideoUrl}${component.idVideo}`;
    expect(component.getVideoUrl()).toBe(expectedUrl);
  });
});
