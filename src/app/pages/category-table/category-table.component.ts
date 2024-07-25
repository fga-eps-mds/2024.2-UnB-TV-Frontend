import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrl: './category-table.component.css'
})
export class CategoryTableComponent {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  aggregatedVideos: any[] = [];
  catalog: Catalog = new Catalog();

  constructor(
    private videoService: VideoService,
    private router: Router
  ) {};
  
  ngOnInit(): void{
    this.findAll();
  }
  
  findAll(): void {
    this.videoService.findAll().subscribe({
      next: (data) => {
        this.videosEduplay = data.body?.videoList ?? [];
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        this.filterVideosByChannel(this.videosEduplay);
        this.videosCatalog(this.unbTvVideos);
        this.aggregateVideosByCategory();
      }
    })
  }

  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;
      if ( channel )
        if ( channel[0].id === this.unbTvChannelId) this.unbTvVideos.push(video);
    });
  }

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
      const keyWordsTitle = video?.title?.toLowerCase() ?? '';
      
      if ( keyWordsTitle ) {
        const category = keywordsCategories.find((config) => 
          config.keywords.some((keyWord) => keyWordsTitle.includes(keyWord))
        );

        if ( category ) {
          video['catalog'] = category?.categoria;
          category.category.push(video);
        } else {
          video['catalog'] = "UnBTV";
          this.catalog.unbtv.push(video);
        }
      };

    });
  }

  aggregateVideosByCategory(): void{
    const categoryMap = new Map<string, { count: number, views: number }>();
    const categories = [
      "Arte e Cultura",
      "Documentais",
      "Entrevista",
      "Jornalismo",
      "Pesquisa e Ciência",
      "Séries Especiais",
      "UnBTV",
      "Variedades"
    ];

    categories.forEach( category => {
      categoryMap.set( category, { count: 0, views: 0 });
    });

    this.unbTvVideos.forEach((video) => {
      const category = video['catalog'];
      const views = video.qtAccess || 0;

      const categoryData = categoryMap.get(category);

      if ( categoryData ) {
        categoryData.count+= 1;
        categoryData.views+= views;
      }
    });

    this.aggregatedVideos = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      videoCount: data.count, 
      totalViews: data.views,
      viewsPerVideo: data.count > 0 ? data.views/data.count : 0
    }));
  }
}

