import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.css']
})
export class CategoryTableComponent {
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
  filteredAggregatedVideos: any[] = [];
  selectedCategories: { [key: string]: boolean } = {};

  fileName = "DadosCategoriasUnBTV.xlsx";

  constructor(
    private videoService: VideoService,
    private router: Router,
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
        this.filterCategories();
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
    });

    this.aggregatedVideos = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      videoCount: data.count, 
      totalViews: data.views,
      viewsPerVideo: data.count > 0 ? data.views/data.count : 0
    }));
    this.filterCategories();
    this.sortAggregatedVideos();
  }

  sortAggregatedVideos(): void {
    if(this.sortColumn){
      this.filteredAggregatedVideos.sort((a, b) => {
        const valueA = a[this.sortColumn];
        const valueB = b[this.sortColumn];

        if(valueA < valueB){
          return this.sortAscending ? -1 : 1;
        }else if(valueA > valueB){
          return this.sortAscending ? 1 : -1;
        }else return 0;

      })
    }
  }

  setSortColumn(column: string): void {
    this.selectedColumn = column;
    if(this.sortColumn === column){
      this.sortAscending = !this.sortAscending;
    }
    else{
      this.sortColumn = column;
      this.sortAscending = true;
    }
    this.sortAggregatedVideos();
  } 

  filterCategories(): void {
    const selectedCategories = Object.keys(this.selectedCategories).filter(category => this.selectedCategories[category]);
    if(selectedCategories.length === 0){
      this.filteredAggregatedVideos = this.aggregatedVideos;
    }
    else{
      this.filteredAggregatedVideos = this.aggregatedVideos.filter(video => selectedCategories.includes(video.category));  
    }
    this.sortAggregatedVideos();
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

  exportExcel() {
    let data = document.getElementById("tabela-categoria");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws,'Sheet1'); 
    XLSX.writeFile(wb, this.fileName);
  }
}

