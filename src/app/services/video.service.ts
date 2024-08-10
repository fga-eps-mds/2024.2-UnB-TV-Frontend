import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  EDUPLAY_API_URL,
  UNB_ID,
  VIDEOS_LIMIT,
  VIDEOS_ORDER,
} from 'src/app/app.constant';
import { IVideo } from 'src/shared/model/video.model';
import { IEduplayVideosByInstitution } from 'src/shared/model/eduplay-by-institution.model';
import { environment } from '../environment/environment';
import { Catalog } from 'src/shared/model/catalog.model';

type VideoResponseType = HttpResponse<IVideo>;
type EduplayByInstitutionResponseType =
  HttpResponse<IEduplayVideosByInstitution>;

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  public videoServiceApiURL = environment.videoAPIURL;
  public resourceUrl = EDUPLAY_API_URL + 'video';
  public eduplayClientKey = environment.EDUPLAY_CLIENT_KEY;
  public unbId = UNB_ID;
  public limit = VIDEOS_LIMIT;
  public order = VIDEOS_ORDER;
  private selectedCatalogProgram = new BehaviorSubject<IVideo[]>([]);
  //catalog: Catalog = new Catalog();

  constructor(private http: HttpClient) { }

  findAll(): Observable<EduplayByInstitutionResponseType> {
    let headers = new HttpHeaders({ clientkey: this.eduplayClientKey });
    return this.http.get<IEduplayVideosByInstitution>(
      `${this.resourceUrl}?institution=${this.unbId}&limit=${this.limit}&order=${this.order}`,
      { headers: headers, observe: 'response' }
    );
  }

  findVideoById(idVideo: number): Observable<VideoResponseType> {
    let headers = new HttpHeaders({ clientkey: this.eduplayClientKey });

    return this.http.get<IVideo>(`${this.resourceUrl}/${idVideo}`, {
      headers: headers,
      observe: 'response',
    });
  }

  setVideosCatalog(videos: IVideo[]) {
    this.selectedCatalogProgram.next(videos);
  }

  getVideosCatalog(): Observable<IVideo[]> {
    return this.selectedCatalogProgram.asObservable();
  }

  //atribui categoria aos videos
  videosCatalog(videos: IVideo[], catalog: Catalog): void {
    const keywordsCategories = [
      {
        keywords: ['fala, jovem'],
        category: catalog.journalism.falaJovem,
        categoria: "Jornalismo",
      },
      {
        keywords: ['informe unb'],
        category: catalog.journalism.informeUnB,
        categoria: "Jornalismo",
      },
      { 
        keywords: ['zapping'],
        category: catalog.journalism.zapping,
        categoria: "Jornalismo",
      },
      {
        keywords: ['brasil em questão'],
        category: catalog.interviews.brasilEmQuestao,
        categoria: "Entrevista",
      },
      {   
        keywords: ['diálogos'], 
        category: catalog.interviews.dialogos,
        categoria: "Entrevista",
      },
      {
        keywords: ['tirando de letra'],
        category: catalog.interviews.tirandoDeLetra,
        categoria: "Entrevista",
      },
      {
        keywords: ['entrevista'],
        category: catalog.interviews.entrevistas,
        categoria: "Entrevista",
      },
      {
        keywords: ['vasto mundo'],
        category: catalog.interviews.vastoMundo,
        categoria: "Entrevista",
      },
      {
        keywords: ['vozes diplomáticas'],
        category: catalog.interviews.vozesDiplomaticas,
        categoria: "Entrevista",
      },
      {
        keywords: ['explique sua tese'],
        category: catalog.researchAndScience.expliqueSuaTese,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['fazendo ciência'],
        category: catalog.researchAndScience.fazendoCiencia,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['radar da extensão'],
        category: catalog.researchAndScience.radarDaExtencao,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['se liga no pas'],
        category: catalog.researchAndScience.seLigaNoPAS,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['unbtv ciência'],
        category: catalog.researchAndScience.unbTvCiencia,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['universidade pra quê?', 'universidade para quê?'],
        category: catalog.researchAndScience.universidadeParaQue,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['[em]cantos'],
        category: catalog.artAndCulture.emCantos,
        categoria: "Arte e Cultura",
      },
      {
        keywords: ['casa do som'],
        category: catalog.artAndCulture.casaDoSom,
        categoria: "Arte e Cultura",
      },
      { 
        keywords: ['esboços'], 
        category: catalog.artAndCulture.esbocos,
        categoria: "Arte e Cultura",
      },
      {
        keywords: ['exclusiva'],
        category: catalog.artAndCulture.exclusiva,
        categoria: "Arte e Cultura",
      },
      {
        keywords: ['floresta de gente'],
        category: catalog.specialSeries.florestaDeGente,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['guia do calouro'],
        category: catalog.specialSeries.guiaDoCalouro,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['memórias sobre paulo freire'],
        category: catalog.specialSeries.memoriasPauloFreire,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['desafios das eleições'],
        category: catalog.specialSeries.desafiosDasEleicoes,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['vida de estudante'],
        category: catalog.specialSeries.vidaDeEstudante,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['arquitetura'],
        category: catalog.specialSeries.arquiteturaICC,
        categoria: "Séries Especiais",
      },
      {
        keywords: [
          'mini doc',
          'cerrado de volta',
          'construção tradicional kalunga',
          'o muro',
          'um lugar para onde voltar',
          'vidas no cárcere',
        ],
        category: catalog.documentaries.miniDoc,
        categoria: "Documentais",
      },
      {
        keywords: [
          'documentários',
          'documentário',
          'quanto vale um terço?',
          'refazendo os caminhos de george gardner',
          'sem hora para chegar',
          'todas podem ser vitímas',
        ],
        category: catalog.documentaries.documentaries,
        categoria: "Documentais",
      },
      {
        keywords: ['pitadas do cerrado'],
        category: catalog.varieties.pitadasDoCerrado,
        categoria: "Variedades",
      },
    ];

    videos.forEach((video) => {
      const keywordsTitle = video?.title?.toLowerCase() ?? '';

      if (keywordsTitle) {
        const category = keywordsCategories.find((config) =>
          config.keywords.some((keyword) => keywordsTitle.includes(keyword))
        );

        if (category) {
          video['catalog'] = category?.categoria;
          category.category.push(video);
        } else {
          video['catalog'] = "UnBTV";
          catalog.unbtv.push(video);
        }
      }
    });
  }

  //Assistir Mais Tarde 
  addToWatchLater(videoId: string, userId: string): Observable<any> {
    console.log(videoId,userId)
    return this.http.post(`${this.videoServiceApiURL}/watch-later/`, { video_id: videoId, user_id: userId });
  }

  removeFromWatchLater(videoId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.videoServiceApiURL}/watch-later/${videoId}`, {
      params: { user_id: userId }
    });
  }
   
  checkWatchLater(videoId: string, userId: string): Observable<any> {
    return this.http.get<any>(`${this.videoServiceApiURL}/watch-later/status/${videoId}`, {
      params: { user_id: userId }
    });
  }

  getWatchLaterVideos(userId: string): Observable<any> {
    return this.http.get<any>(`${this.videoServiceApiURL}/watch-later/`, {
      params: { user_id: userId }
    });
  } 

  // Favoritar
  addToFavorite(videoId: string, userId: string): Observable<any> {
    console.log('Adding to favorite:', videoId, userId)
    return this.http.post(`${this.videoServiceApiURL}/favorite/`, { video_id: videoId, user_id: userId });
  }

  removeFromFavorite(videoId: string, userId: string): Observable<any> {
    return this.http.delete(`${this.videoServiceApiURL}/favorite/${videoId}`, {
      params: { user_id: userId }
    });
  }
  

  checkFavorite(videoId: string, userId: string): Observable<any> {
    return this.http.get<any>(`${this.videoServiceApiURL}/favorite/status/${videoId}`, {
      params: { user_id: userId }
    });
  }

  getFavoriteVideos(userId: string): Observable<any> {
    return this.http.get<any>(`${this.videoServiceApiURL}/favorite/`, {
      params: { user_id: userId }
    });
  } 
 
}