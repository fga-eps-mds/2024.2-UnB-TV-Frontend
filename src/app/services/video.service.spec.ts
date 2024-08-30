import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {
  EDUPLAY_API_URL,
  UNB_ID,
  VIDEOS_LIMIT,
  VIDEOS_ORDER,
} from 'src/app/app.constant';
import { environment } from '../environment/environment';
import { VideoService } from './video.service';
import { IVideo } from 'src/shared/model/video.model';
import { Catalog } from 'src/shared/model/catalog.model';

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
  },
];

describe('VideoService', () => {
  let service: VideoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VideoService],
    });

    service = TestBed.inject(VideoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure that there are no outstanding requests.
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findAll', () => {
    it('should return all videos by institution', () => {
      const mockData = {
        qtTotal: 110,
        videoList: [
          {
            id: 142471,
            title: 'Sala de Reunião 04 do NTE',
            description: 'Sala de Reunião 04 do NTE',
            keywords: 'Sala de Reunião 04 do NTE',
            visibility: 'PUBLIC',
            duration: 561835,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 41,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1630091029232.png',
              },
            ],
            userOwner: {
              id: 30684,
              name: 'Fabio Ferreira de Oliveira',
            },
          },
          {
            id: 180741,
            title: 'Mulheres que inspiram - Profa. Carla Rocha',
            description:
              '<p>Entrevista com a Professora Carla Rocha (UnB) como parte do projeto Mulheres que Inspiram. Adeia surgiu através da leitura do texto Eu programo, tu programas, elx hackea: mulheres hackers e perspectivas tecnopolíticas e do interesse em dar visibilidade a mulheres que atuam na área de software livre e educação aberta. Transcrição do áudio disponível..em https://pt.wikiversity.org/wiki/Educa%C3%A7%C3%A3o_Aberta/Mulheres_que_inspiram</p><p><br /></p><p>Disponível com uma licença CC-BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).</p>',
            keywords:
              'mulheres, computação, professora, ciência da computação, gênero',
            visibility: 'PUBLIC',
            duration: 508459,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 36,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1679168690066.jpg',
              },
            ],
            userOwner: {
              id: 44590,
              name: 'Tel Amiel',
              avatar:
                'https://eduplay.rnp.br/portal/assets/users/images/1683107832084.jpg',
            },
          },
          {
            id: 184760,
            title:
              'Dia 4: Minicurso de Extensão - UnB - Racontez-nous votre histoire',
            keywords: 'mconf',
            visibility: 'PUBLIC',
            duration: 5161003,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 24,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1687455434581.png',
              },
            ],
            userOwner: {
              id: 45799,
              name: 'Denise Gisele de Britto Damasco',
            },
          },
          {
            id: 184518,
            title:
              'Dia 1: Minicurso de Extensão - UnB - Présentation Denise Damasco',
            keywords: 'mconf',
            visibility: 'PUBLIC',
            duration: 3532366,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 24,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1686872273578.png',
              },
            ],
            userOwner: {
              id: 45799,
              name: 'Denise Gisele de Britto Damasco',
            },
          },
          {
            id: 111840,
            title:
              'Aulas Síncronas ás 14 horas as terças-feiras e quintas-feiras',
            description:
              'Aulas Síncronas ás 14 horas as terças-feiras e quintas-feiras',
            keywords:
              'Aulas Síncronas ás 14 horas as terças-feiras e quintas-feiras',
            visibility: 'PUBLIC',
            duration: 6111573,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 38,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1621608406505.png',
              },
            ],
            userOwner: {
              id: 28703,
              name: 'Jorlandio Francisco Felix',
            },
          },
          {
            id: 141981,
            title: 'Liliane Campos Machado',
            description: 'Liliane Campos Machado',
            keywords: 'Liliane Campos Machado',
            visibility: 'PUBLIC',
            duration: 6482260,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 162,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1629828306049.png',
              },
            ],
            userOwner: {
              id: 29754,
              name: 'Liliane Campos Machado',
            },
          },
          {
            id: 111535,
            title: 'NTE videoconferências',
            description: 'NTE videoconferências',
            keywords: 'NTE videoconferências',
            visibility: 'PUBLIC',
            duration: 7508000,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 73,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1621383436732.png',
              },
            ],
            userOwner: {
              id: 19994,
              name: 'Endryl Francelino de Souza',
            },
          },
          {
            id: 184759,
            title:
              'Dia 3: Minicurso de Extensão - UnB - Racontez-nous votre histoire',
            keywords: 'mconf',
            visibility: 'PUBLIC',
            duration: 5175560,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 24,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1687454416354.png',
              },
            ],
            userOwner: {
              id: 45799,
              name: 'Denise Gisele de Britto Damasco',
            },
          },
          {
            id: 179217,
            title: 'Patricia Tuxi dos Santos',
            description: 'Patricia Tuxi dos Santos',
            keywords: 'Patricia Tuxi dos Santos',
            visibility: 'PUBLIC',
            duration: 109163,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 42,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1675876887636.png',
              },
            ],
            userOwner: {
              id: 44725,
              name: 'Patricia Tuxi dos Santos',
            },
          },
          {
            id: 142458,
            title: 'Sala de Reunião 04 do NTE',
            description: 'Sala de Reunião 04 do NTE',
            keywords: 'Sala de Reunião 04 do NTE',
            visibility: 'PUBLIC',
            duration: 2750269,
            generateLibras: true,
            generateSubtitle: true,
            qtAccess: 75,
            qtLikes: 0,
            images: [
              {
                type: 'DEFAULT',
                href: 'https://eduplay.rnp.br/portal/assets/videos/images/1630088527294.png',
              },
            ],
            userOwner: {
              id: 30684,
              name: 'Fabio Ferreira de Oliveira',
            },
          },
        ],
      };

      service.findAll().subscribe((response) => {
        expect(response.body).toEqual(mockData);
      });

      const req = httpMock.expectOne(
        `${EDUPLAY_API_URL}video?institution=${UNB_ID}&limit=${VIDEOS_LIMIT}&order=${VIDEOS_ORDER}`
      );
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('clientkey')).toBe(environment.EDUPLAY_CLIENT_KEY);

      req.flush(mockData);
    });
  });

  describe('findVideoById', () => {
    it('should return a video', () => {
      const mockId = 185814;
      const mockData = {
        id: 185814,
        title: 'Tutorial - Etherpad',
        description:
          '<p>Tutorial do projeto Escolha Livre (escolhalivre.org.br) apresentando o Etherpad (como o pad.riseup.net), um software livre.</p><p><br /></p><p>Produzido pela Iniciativa Educação Aberta (aberta.org.br).</p><p><br />Licença de uso: CC-BY-SA 4.0 (https://creativecommons.org/licenses/by-sa/4.0/).</p><p><br /></p><p><br /></p>',
        keywords: 'software livre, escrita colaborativa, FOSS, colaboração',
        visibility: 'PUBLIC',
        duration: 250367,
        embed:
          '<iframe width="671" height="377" src="https://eduplay.rnp.br/portal/video/embed/185814" frameborder="0" scrolling="no" allowfullscreen></iframe>',
        generateLibras: true,
        generateSubtitle: true,
        qtAccess: 28,
        qtLikes: 0,
        images: [
          {
            type: 'DEFAULT',
            href: 'https://eduplay.rnp.br/portal/assets/videos/images/1689705451523.jpg',
          },
        ],
        institution: {
          id: 216,
          name: 'Universidade de Brasilia',
          code: 'UNB',
        },
        userOwner: {
          id: 44590,
          name: 'Tel Amiel',
          avatar:
            'https://eduplay.rnp.br/portal/assets/users/images/1683107832084.jpg',
        },
        channels: [
          {
            id: 183065,
            name: 'Cátedra UNESCO em EaD',
          },
        ],
      };

      service.findVideoById(mockId).subscribe((response) => {
        expect(response.body).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${EDUPLAY_API_URL}video/${mockId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('clientkey')).toBe(environment.EDUPLAY_CLIENT_KEY);

      req.flush(mockData);
    });
  });

  describe('setVideosCatalog', () => {
    it('should set videos catalog', () => {
      const mockVideos = mockData;

      service.setVideosCatalog(mockVideos);

      service.getVideosCatalog().subscribe((videos) => {
        expect(videos).toEqual(mockVideos);
      });
    });
  });

  describe('getVideosCatalog', () => {
    it('should get videos catalog', () => {
      const mockVideos = mockData;
      service.setVideosCatalog(mockVideos);

      service.getVideosCatalog().subscribe((videos) => {
        expect(videos).toEqual(mockVideos);
      });
    });
  });

  describe('videosCatalog', () => {
    it('should categorize videos correctly', () => {
      const mockVideos: IVideo[] = [
        {
          id: 1,
          title: 'Fala, jovem',
          description: '',
          keywords: '',
          visibility: 'PUBLIC',
          duration: 1000,
          embed: '',
          generateLibras: false,
          generateSubtitle: false,
          qtAccess: 0,
          qtLikes: 0,
          images: [],
          channels: [],
        },
        {
          id: 2,
          title: 'Informe UnB',
          description: '',
          keywords: '',
          visibility: 'PUBLIC',
          duration: 1000,
          embed: '',
          generateLibras: false,
          generateSubtitle: false,
          qtAccess: 0,
          qtLikes: 0,
          images: [],
          channels: [],
        },
        {
          id: 3,
          title: 'Esboços: Artista',
          description: '',
          keywords: '',
          visibility: 'PUBLIC',
          duration: 1000,
          embed: '',
          generateLibras: false,
          generateSubtitle: false,
          qtAccess: 0,
          qtLikes: 0,
          images: [],
          channels: [],
        },
        {
          id: 4,
          title: 'Vídeo sem categoria específica',
          description: '',
          keywords: '',
          visibility: 'PUBLIC',
          duration: 1000,
          embed: '',
          generateLibras: false,
          generateSubtitle: false,
          qtAccess: 0,
          qtLikes: 0,
          images: [],
          channels: [],
        },
      ];

      // expect(mockVideos[0]['catalog']).toBe('Jornalismo');
      // expect(service.catalog.journalism.falaJovem).toContain(mockVideos[0]);


      // expect(mockVideos[1]['catalog']).toBe('Jornalismo');
      // expect(service.catalog.journalism.informeUnB).toContain(mockVideos[1]);


      // expect(mockVideos[2]['catalog']).toBe('Arte e Cultura');
      // expect(service.catalog.artAndCulture.esbocos).toContain(mockVideos[2]);


      // expect(mockVideos[3]['catalog']).toBe('UnBTV');
      // expect(service.catalog.unbtv).toContain(mockVideos[3]);
    });
  });


  describe('addToWatchLater', () => {
    it('should add a video to the watch later list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { message: 'Added to watch later list' };


      service.addToWatchLater(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(`${environment.videoAPIURL}/watch-later/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ video_id: mockVideoId, user_id: mockUserId });


      req.flush(mockResponse);
    });
  });


  describe('removeFromWatchLater', () => {
    it('should remove a video from the watch later list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { message: 'Removed from watch later list' };


      service.removeFromWatchLater(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/watch-later/${mockVideoId}?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('DELETE');


      req.flush(mockResponse);
    });
  });


  describe('checkWatchLater', () => {
    it('should check if a video is in the watch later list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { status: true };


      service.checkWatchLater(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/watch-later/status/${mockVideoId}?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });

  describe('getWatchLaterVideos', () => {
    it('should get all videos in the watch later list for a user', () => {
      const mockUserId = 'user123';
      const mockResponse = {
        videoList: [
          { video_id: '12345', status: true },
          { video_id: '67890', status: true },
        ],
      };


      service.getWatchLaterVideos(mockUserId).subscribe((response) => {
        expect(response.videoList.length).toBe(2);
        expect(response.videoList).toEqual(mockResponse.videoList);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/watch-later/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });

  describe('getFavoriteVideos', () => {
    it('should get all videos in favorite list for a user', () => {
      const mockUserId = 'user123';
      const mockResponse = {
        videoList: [
          { video_id: '12345', status: true },
          { video_id: '67890', status: true },
        ],
      };

      service.getFavoriteVideos(mockUserId).subscribe((response) => {
        expect(response.videoList.length).toBe(2);
        expect(response.videoList).toEqual(mockResponse.videoList);
      });

      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/favorite/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });
  });

  describe('addToFavorite', () => {
    it('should add a video to the favorite list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { message: 'Added to favorite list' };


      service.addToFavorite(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(`${environment.videoAPIURL}/favorite/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ video_id: mockVideoId, user_id: mockUserId });


      req.flush(mockResponse);
    });
  });

  describe('removeFromFavorite', () => {
    it('should remove a video from the favorite list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { message: 'Removed from favorite list' };


      service.removeFromFavorite(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/favorite/${mockVideoId}?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('DELETE');


      req.flush(mockResponse);
    });
  });



  describe('checkFavorite', () => {
    it('should check if a video is in the favorite list', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const mockResponse = { statusfavorite: true };


      service.checkFavorite(mockVideoId, mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/favorite/status/${mockVideoId}?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');

      req.flush(mockResponse);
    });
  });


  describe('getFavoriteVideos', () => {
    it('should get all videos in favorite list for a user', () => {
      const mockUserId = 'user123';
      const mockResponse = {
        videoList: [
          { video_id: '12345', status: true },
          { video_id: '67890', status: true },
        ],
      };


      service.getFavoriteVideos(mockUserId).subscribe((response) => {
        expect(response.videoList.length).toBe(2);
        expect(response.videoList).toEqual(mockResponse.videoList);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/favorite/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('checkRecord', () => {
    it('should check the user record history', () => {
      const mockUserId = 'user123';
      const mockResponse = {
        videos: {
          "12345": "2024-08-14 12:00:00",
          "67890": "2024-08-14 12:10:00",
        },
      };


      service.checkRecord(mockUserId).subscribe((response) => {
        expect(response.videos).toEqual(mockResponse.videos);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/record/get_record/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('addToRecord', () => {
    it('should add a video to the record history', () => {
      const mockVideoId = '12345';
      const mockUserId = 'user123';
      const currentDateTime = new Date().toLocaleString();
      const mockResponse = { message: 'Video added to record' };


      service.addToRecord(mockUserId, mockVideoId).subscribe((response) => {
        expect(response.message).toEqual(mockResponse.message);
      });


      const req = httpMock.expectOne(`${environment.videoAPIURL}/record/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        user_id: mockUserId,
        videos: { [mockVideoId]: currentDateTime },
      });


      req.flush(mockResponse);
    });
  });


describe('toggleTracking', () => {
  it('should toggle tracking on or off', () => {
    const mockUserId = 'user123';
    const mockTrack = true;
    const mockResponse = { message: 'Rastreamento habilitado' };


    service.toggleTracking(mockUserId, mockTrack).subscribe((response) => {
      expect(response.message).toEqual(mockResponse.message);
    });


    // Ajuste na verificação da URL
    const req = httpMock.expectOne(
      (request) =>
        request.url === `${environment.videoAPIURL}/record/toggle_tracking/` &&
        request.params.get('user_id') === mockUserId &&
        request.params.get('track') === mockTrack.toString()
    );


    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });
});




  describe('getRecordSorted', () => {
    it('should get the sorted record videos', () => {
      const mockUserId = 'user123';
      const mockAscending = true;
      const mockResponse = {
        videos: {
          "12345": "2024-08-14 12:00:00",
          "67890": "2024-08-14 12:10:00",
        },
      };


      service.getRecordSorted(mockUserId, mockAscending).subscribe((response) => {
        expect(response.videos).toEqual(mockResponse.videos);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/record/get_record_sorted/?user_id=${mockUserId}&ascending=${mockAscending}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });


  describe('checkTrackingStatus', () => {
    it('should check the tracking status for the user', () => {
      const mockUserId = 'user123';
      const mockResponse = { track_enabled: true };


      service.checkTrackingStatus(mockUserId).subscribe((response) => {
        expect(response.track_enabled).toBe(mockResponse.track_enabled);
      });


      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/record/get_tracking_status/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');


      req.flush(mockResponse);
    });
  });

  //testes proximo video

  //filtragem por categoria
  function filterVideosByCategory(videos: IVideo[], category: string): IVideo[] {
    return videos.filter(video => video.catalog === category);
  }

  describe('filterVideosByCategory', () => {
    it('should return videos that match the specified category', () => {
      const videos = [
        { id: 1, title: 'Video 1', catalog: 'Jornalismo' } as IVideo,
        { id: 2, title: 'Video 2', catalog: 'Documentais' } as IVideo,
        { id: 3, title: 'Video 3', catalog: 'Jornalismo' } as IVideo
      ];

      const result = filterVideosByCategory(videos, 'Jornalismo');

      expect(result.length).toBe(2);
      expect(result).toEqual([videos[0], videos[2]]);
    });

    it('should return an empty array if no videos match the category', () => {
      const videos = [
        { id: 1, title: 'Video 1', catalog: 'Documentais' } as IVideo,
        { id: 2, title: 'Video 2', catalog: 'Variedades' } as IVideo
      ];

      const result = filterVideosByCategory(videos, 'Jornalismo');

      expect(result.length).toBe(0);
    });
  });
  
  //mapear catalog e program
  function getCatalogAndProgramMaps(catalog: Catalog): { catalogMap: any; programMap: any } {
    const catalogMap: any = {
      Jornalismo: catalog.journalism,
      Entrevistas: catalog.interviews,
      PesquisaECiencia: catalog.researchAndScience,
      ArteECultura: catalog.artAndCulture,
      SeriesEspeciais: catalog.specialSeries,
      Documentarios: catalog.documentaries,
      Variedades: catalog.varieties,
      UnBTV: catalog.unbtv
    };
  
    const programMap: any = {
      Jornalismo: {
        falaJovem: "falaJovem",
        informeUnB: "informeUnb",
        zapping: "zapping"
      },
      Entrevistas: {
        brasilEmQuestao: "brasilEmQuestao",
        dialogos: "dialogos",
        entrevistas: "entrevistas",
        tirandoDeLetra: "tirandoDeLetra",
        vastoMundo: "vastoMundo",
        vozesDiplomaticas: "vozesDiplomaticas"
      },
      PesquisaECiencia: {
        expliqueSuaTese: "expliqueSuaTese",
        fazendoCiencia: "fazendoCiencia",
        radarDaExtencao: "radarDaExtencao",
        seLigaNoPAS: "seLigaNoPAS",
        unbTvCiencia: "unbTvCiencia",
        universidadeParaQue: "universidadeParaQue"
      },
      ArteECultura: {
        casaDoSom: "casaDoSom",
        emCantos: "emCantos",
        esbocos: "esbocos",
        exclusiva: "exclusiva"
      },
      SeriesEspeciais: {
        arquiteturaICC: "arquiteturaICC",
        desafiosDasEleicoes: "desafiosDasEleicoes",
        florestaDeGente: "florestaDeGente",
        guiaDoCalouro: "guiaDoCalouro",
        memoriasPauloFreire: "memoriasPauloFreire",
        vidaDeEstudante: "vidaDeEstudante"
      },
      Documentarios: {
        documentaries: "documentaries",
        miniDoc: "miniDoc"
      },
      Variedades: {
        pitadasDoCerrado: "pitadasDoCerrado"
      },
      UnBTV: []
    };
  
    return { catalogMap, programMap };
  }

  describe('getCatalogAndProgramMaps', () => {
    it('should return correct catalog and program maps', () => {
      const catalog: Catalog = {
        journalism: {
          falaJovem: [],
          informeUnB: [],
          zapping: []
        },
        interviews: {
          brasilEmQuestao: [],
          dialogos: [],
          entrevistas: [],
          tirandoDeLetra: [],
          vastoMundo: [],
          vozesDiplomaticas: []
        },
        researchAndScience: {
          expliqueSuaTese: [],
          fazendoCiencia: [],
          radarDaExtencao: [],
          seLigaNoPAS: [],
          unbTvCiencia: [],
          universidadeParaQue: []
        },
        artAndCulture: {
          casaDoSom: [],
          emCantos: [],
          esbocos: [],
          exclusiva: []
        },
        specialSeries: {
          arquiteturaICC: [],
          desafiosDasEleicoes: [],
          florestaDeGente: [],
          guiaDoCalouro: [],
          memoriasPauloFreire: [],
          vidaDeEstudante: []
        },
        documentaries: {
          documentaries: [],
          miniDoc: []
        },
        varieties: {
          pitadasDoCerrado: []
        },
        unbtv: []
      };
  
      const { catalogMap, programMap } = getCatalogAndProgramMaps(catalog);
  
      expect(catalogMap.Jornalismo).toEqual(catalog.journalism);
      expect(programMap.Jornalismo).toEqual({
        falaJovem: "falaJovem",
        informeUnB: "informeUnb",
        zapping: "zapping"
      });
    });
  });

  describe('findProgramName', () => {
    it('should return the correct program name for the current video', () => {
      const catalog: Catalog = {
        journalism: {
          falaJovem: [
            { id: 1, title: 'Fala, jovem' },
            { id: 2, title: 'Informe UnB' },
          ],
          informeUnB: [],
          zapping: []
        },
        interviews: {
          brasilEmQuestao: [],
          dialogos: [],
          entrevistas: [],
          tirandoDeLetra: [],
          vastoMundo: [],
          vozesDiplomaticas: []
        },
        researchAndScience: {
          expliqueSuaTese: [],
          fazendoCiencia: [],
          radarDaExtencao: [],
          seLigaNoPAS: [],
          unbTvCiencia: [],
          universidadeParaQue: []
        },
        artAndCulture: {
          casaDoSom: [],
          emCantos: [],
          esbocos: [],
          exclusiva: []
        },
        specialSeries: {
          arquiteturaICC: [],
          desafiosDasEleicoes: [],
          florestaDeGente: [],
          guiaDoCalouro: [],
          memoriasPauloFreire: [],
          vidaDeEstudante: []
        },
        documentaries: {
          documentaries: [],
          miniDoc: []
        },
        varieties: {
          pitadasDoCerrado: []
        },
        unbtv: []
      };
  
      const videoService = TestBed.inject(VideoService);
  
      const programName = videoService.findProgramName(catalog, 'Jornalismo', 1);
      expect(programName).toBe('falaJovem');
    });
  
    it('should return "unbtv" if the video is not found in any program', () => {
      const catalog: Catalog = {
        journalism: {
          falaJovem: [],
          informeUnB: [],
          zapping: []
        },
        interviews: {
          brasilEmQuestao: [],
          dialogos: [],
          entrevistas: [],
          tirandoDeLetra: [],
          vastoMundo: [],
          vozesDiplomaticas: []
        },
        researchAndScience: {
          expliqueSuaTese: [],
          fazendoCiencia: [],
          radarDaExtencao: [],
          seLigaNoPAS: [],
          unbTvCiencia: [],
          universidadeParaQue: []
        },
        artAndCulture: {
          casaDoSom: [],
          emCantos: [],
          esbocos: [],
          exclusiva: []
        },
        specialSeries: {
          arquiteturaICC: [],
          desafiosDasEleicoes: [],
          florestaDeGente: [],
          guiaDoCalouro: [],
          memoriasPauloFreire: [],
          vidaDeEstudante: []
        },
        documentaries: {
          documentaries: [],
          miniDoc: []
        },
        varieties: {
          pitadasDoCerrado: []
        },
        unbtv: []
      };
  
      const videoService = TestBed.inject(VideoService);
  
      const programName = videoService.findProgramName(catalog, 'Jornalismo', 999);
      expect(programName).toBe('unbtv');
    });
  });

  describe('recommendVideo', () => {
    let catalog: Catalog;
    let videos: IVideo[];
    let watchedVideos: IVideo[];
    let videoService: VideoService;
  
    beforeEach(() => {
      videoService = TestBed.inject(VideoService);
  
      catalog = {
        journalism: {
          falaJovem: [
            { id: 1, title: 'Fala, jovem' },
            { id: 2, title: 'Informe UnB' },
          ],
          informeUnB: [],
          zapping: []
        },
        interviews: {
          brasilEmQuestao: [],
          dialogos: [],
          entrevistas: [],
          tirandoDeLetra: [],
          vastoMundo: [],
          vozesDiplomaticas: []
        },
        researchAndScience: {
          expliqueSuaTese: [],
          fazendoCiencia: [],
          radarDaExtencao: [],
          seLigaNoPAS: [],
          unbTvCiencia: [],
          universidadeParaQue: []
        },
        artAndCulture: {
          casaDoSom: [],
          emCantos: [],
          esbocos: [],
          exclusiva: []
        },
        specialSeries: {
          arquiteturaICC: [],
          desafiosDasEleicoes: [],
          florestaDeGente: [],
          guiaDoCalouro: [],
          memoriasPauloFreire: [],
          vidaDeEstudante: []
        },
        documentaries: {
          documentaries: [],
          miniDoc: []
        },
        varieties: {
          pitadasDoCerrado: []
        },
        unbtv: []
      };
  
      videos = [
        { id: 1, title: 'Fala, jovem', catalog: 'Jornalismo' } as IVideo,
        { id: 2, title: 'Informe UnB', catalog: 'Jornalismo' } as IVideo,
        { id: 3, title: 'Esboços: Artista', catalog: 'Arte e Cultura' } as IVideo,
        { id: 4, title: 'Vídeo sem categoria específica', catalog: 'UnBTV' } as IVideo,
      ];
  
      watchedVideos = [{ id: 1, title: 'Fala, jovem' } as IVideo];
    });
  
    it('should recommend the next video in the same program if not watched', () => {
      const nextVideoId = videoService.recommendVideo(
        videos,
        catalog,
        'Jornalismo',
        watchedVideos,
        'falaJovem',
        123456
      );
  
      expect(nextVideoId).toBe(2); // Informe UnB should be recommended next
    });
  
    it('should recommend a video from the same category if all videos in the program are watched', () => {
      watchedVideos = [{ id: 1, title: 'Fala, jovem' } as IVideo, { id: 2, title: 'Informe UnB' } as IVideo];
  
      const nextVideoId = videoService.recommendVideo(
        videos,
        catalog,
        'Arte e Cultura',
        watchedVideos,
        'esbocos',
        123456
      );
  
      expect(nextVideoId).toBe(3); // Esboços: Artista should be recommended
    });
  
    it('should return the recommended video id if all videos in the category are watched', () => {
      watchedVideos = [
        { id: 1, title: 'Fala, jovem', catalog: 'Jornalismo' } as IVideo,
        { id: 2, title: 'Informe UnB', catalog: 'Jornalismo' } as IVideo,
        { id: 3, title: 'Esboços: Artista', catalog: 'Arte e Cultura' } as IVideo,
        { id: 4, title: 'Vídeo sem categoria específica', catalog: 'UnBTV' } as IVideo, // Todos os vídeos foram assistidos
      ];
    
      const nextVideoId = videoService.recommendVideo(
        videos,
        catalog,
        'Jornalismo',
        watchedVideos,
        'falaJovem',
        123456
      );
    
      expect(nextVideoId).toBe(123456); // No video left to recommend
    });
  
    it('should return the recommended video id if the program or category does not exist', () => {
      const nextVideoId = videoService.recommendVideo(
        videos,
        catalog,
        'Nonexistent Category',
        watchedVideos,
        'unbtv',
        123456
      );
  
      expect(nextVideoId).toBe(123456); // Invalid category and program
    });
  });  

  describe('getRecommendationFromRecord', () => {
    it('should get the recommendation from record for a user', () => {
      const mockUserId = 'user123';
      const mockResponse = {
        recommend_videos: {
          1: 'Mock Video Recommendation 1',
          2: 'Mock Video Recommendation 2',
        },
      };
  
      service.getRecommendationFromRecord(mockUserId).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });
  
      const req = httpMock.expectOne(
        `${environment.videoAPIURL}/recommendation/get_recommendation_record/?user_id=${mockUserId}`
      );
      expect(req.request.method).toBe('GET');
  
      req.flush(mockResponse);
    });
  });
  
});
