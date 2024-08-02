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
  catalog: Catalog = new Catalog();

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
  videosCatalog(videos: IVideo[]): void {
    const keywordsCategories = [
      {
        keywords: ['fala, jovem'],
        category: this.catalog.journalism.falaJovem,
        categoria: "Jornalismo",
      },
      {
        keywords: ['informe unb'],
        category: this.catalog.journalism.informeUnB,
        categoria: "Jornalismo",
      },
      { 
        keywords: ['zapping'],
        category: this.catalog.journalism.zapping,
        categoria: "Jornalismo",
      },
      {
        keywords: ['brasil em questão'],
        category: this.catalog.interviews.brasilEmQuestao,
        categoria: "Entrevista",
      },
      { 
        keywords: ['diálogos'], 
        category: this.catalog.interviews.dialogos,
        categoria: "Entrevista",
      },
      {
        keywords: ['tirando de letra'],
        category: this.catalog.interviews.tirandoDeLetra,
        categoria: "Entrevista",
      },
      {
        keywords: ['entrevista'],
        category: this.catalog.interviews.entrevistas,
        categoria: "Entrevista",
      },
      {
        keywords: ['vasto mundo'],
        category: this.catalog.interviews.vastoMundo,
        categoria: "Entrevista",
      },
      {
        keywords: ['vozes diplomáticas'],
        category: this.catalog.interviews.vozesDiplomaticas,
        categoria: "Entrevista",
      },
      {
        keywords: ['explique sua tese'],
        category: this.catalog.researchAndScience.expliqueSuaTese,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['fazendo ciência'],
        category: this.catalog.researchAndScience.fazendoCiencia,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['radar da extensão'],
        category: this.catalog.researchAndScience.radarDaExtencao,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['se liga no pas'],
        category: this.catalog.researchAndScience.seLigaNoPAS,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['unbtv ciência'],
        category: this.catalog.researchAndScience.unbTvCiencia,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['universidade pra quê?', 'universidade para quê?'],
        category: this.catalog.researchAndScience.universidadeParaQue,
        categoria: "Pesquisa e Ciência",
      },
      {
        keywords: ['[em]cantos'],
        category: this.catalog.artAndCulture.emCantos,
        categoria: "Arte e Cultura",
      },
      {
        keywords: ['casa do som'],
        category: this.catalog.artAndCulture.casaDoSom,
        categoria: "Arte e Cultura",
      },
      { 
        keywords: ['esboços'], 
        category: this.catalog.artAndCulture.esbocos,
        categoria: "Arte e Cultura",
      },
      {
        keywords: ['exclusiva'],
        category: this.catalog.artAndCulture.exclusiva,
        categoria: "Arte e Cultura",
      },
      {
        keywords: ['floresta de gente'],
        category: this.catalog.specialSeries.florestaDeGente,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['guia do calouro'],
        category: this.catalog.specialSeries.guiaDoCalouro,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['memórias sobre paulo freire'],
        category: this.catalog.specialSeries.memoriasPauloFreire,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['desafios das eleições'],
        category: this.catalog.specialSeries.desafiosDasEleicoes,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['vida de estudante'],
        category: this.catalog.specialSeries.vidaDeEstudante,
        categoria: "Séries Especiais",
      },
      {
        keywords: ['arquitetura'],
        category: this.catalog.specialSeries.arquiteturaICC,
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
        category: this.catalog.documentaries.miniDoc,
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
        category: this.catalog.documentaries.documentaries,
        categoria: "Documentais",
      },
      {
        keywords: ['pitadas do cerrado'],
        category: this.catalog.varieties.pitadasDoCerrado,
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
          this.catalog.unbtv.push(video);
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
}