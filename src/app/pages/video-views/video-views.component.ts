import { Component } from '@angular/core';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';

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

  constructor(private videoService: VideoService) {}

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
    this.filteredVideos = this.unbTvVideos.filter(video => 
      (this.filterId ? video.id?.toString().includes(this.filterId) : true) &&
      (this.filterTitle ? video.title?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true) &&
      (this.filterDescription ? video.description?.toLowerCase().includes(this.filterDescription.toLowerCase()) : true) &&
      this.filterByCategory(video.catalog)
    );

  }

  filterByCategory(catalog: string): boolean {
    const selectedCategories = Object.keys(this.selectedCategories).filter(category => this.selectedCategories[category]);
    if (selectedCategories.length === 0) {
      return true;
    }
    return selectedCategories.includes(catalog);
  }


}
