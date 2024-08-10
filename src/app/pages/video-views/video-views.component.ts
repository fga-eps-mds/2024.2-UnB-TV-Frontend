import { Component } from '@angular/core';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-video-views',
  templateUrl: './video-views.component.html',
  styleUrls: ['./video-views.component.css']
})
export class VideoViewsComponent {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();

  filteredVideos: IVideo[] = [];
  filterId: string = '';
  filterTitle: string = '';
  filterDescription: string = '';
  selectedCategories: { [key: string]: boolean } = {};
  categories: string[] = ['Jornalismo', 'Entrevista', 'Pesquisa e Ciência', 'Arte e Cultura', 'Séries Especiais', 'Documentais', 'UnBTV'];
  
  sortAscending: boolean = true;
  isSorted: boolean = false;

  fileName = "DadosVideosUnBTV.xlsx";

  constructor(
    private videoService: VideoService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {};

  ngOnInit(): void {
    this.findAll();
    this.filteredVideos = this.unbTvVideos;
    this.categories.forEach(category => this.selectedCategories[category] = false);
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
        this.videoService.videosCatalog(this.unbTvVideos); // Chamando a função do serviço
        this.cleanDescriptions();
        this.filterVideos();
      },
    });
  } 

  cleanDescriptions() {
    const cleanHtml = (html:string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || "";
    };
  
    this.unbTvVideos.forEach((video) => {
      if (video.description) {
        video.description = cleanHtml(video.description);
      }
    });
  } 
  

  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;

      if (channel)
        if (channel[0].id === this.unbTvChannelId) this.unbTvVideos.push(video);
    });
  }

  filterVideos() {
    const selectedCategories = Object.keys(this.selectedCategories).filter(category => this.selectedCategories[category]);
    
    this.filteredVideos = this.unbTvVideos.filter(video => 
        (this.filterId ? video.id?.toString().includes(this.filterId) : true) &&
        (this.filterTitle ? video.title?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true) &&
        (this.filterDescription ? video.description?.toLowerCase().includes(this.filterDescription.toLowerCase()) : true) &&
        (selectedCategories.length === 0 || selectedCategories.includes(video.catalog))
    );
    this.sortVideos();
  }

  sortVideos(): void {
    this.filteredVideos.sort((videoA, videoB) => {
        const accessA = videoA.qtAccess  || 0;
        const accessB = videoB.qtAccess  || 0;

        if (this.sortAscending) {
            // Ordenação crescente
            return accessA - accessB;
        } else {
            // Ordenação decrescente
            return accessB - accessA;
        }
    });
  }

  changeSortOrder(): void {
      this.sortAscending = !this.sortAscending;
      this.sortVideos();
      this.isSorted = true;
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
    let data = document.getElementById("tabela-videos");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    const columnWidths = [
      { wch:15 },
      { wch:120 },
      { wch:1200 },
      { wch:20 },
      { wch:20 }
    ];

    ws['!cols'] = columnWidths;
    XLSX.utils.book_append_sheet(wb, ws,'Sheet1'); 
    XLSX.writeFile(wb, this.fileName);
  }
}
