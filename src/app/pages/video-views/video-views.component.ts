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

  constructor(private videoService: VideoService) {}

  ngOnInit(): void {
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
        this.videoService.videosCatalog(this.unbTvVideos); // Chamando a função do serviço
        this.cleanDescriptions();
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

}
