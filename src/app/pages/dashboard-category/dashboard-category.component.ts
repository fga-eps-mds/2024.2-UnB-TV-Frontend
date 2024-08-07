import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-dashboard-category',
  templateUrl: './dashboard-category.component.html',
  styleUrls: ['./dashboard-category.component.css'],
})
export class DashboardCategoryComponent {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  aggregatedVideos: any[] = [];
  catalog: Catalog = new Catalog();
  sortColumn: string = '';
  sortAscending: boolean = true;
  selectedColumn: string = '';
  categories: string[] = [
    "Arte e Cultura",
    "Documentais",
    "Entrevista",
    "Jornalismo",
    "Pesquisa e Ciência",
    "Séries Especiais",
    "UnBTV",
    "Variedades"
  ];

  selectedCategories: { [key: string]: boolean } = {};
  viewsAllCategories: number = 0;
  videosAllCategories: number = 0;

  constructor(
    private videoService: VideoService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {};
  
  ngOnInit(): void{
    this.categories.forEach(category => this.selectedCategories[category] = false);
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
        this.videoService.videosCatalog(this.unbTvVideos);
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
      this.viewsAllCategories += views;
      this.videosAllCategories += 1;
    });

    this.aggregatedVideos = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      videoCount: data.count, 
      totalViews: data.views,
      viewsPerVideo: data.count > 0 ? data.views/data.count : 0
    }));
  }

  logoutUser() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja sair?',
      header: 'Confirmação',
      key: 'myDialog',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.authService.logout();
      },
      reject: () => {},
    });
  }
}