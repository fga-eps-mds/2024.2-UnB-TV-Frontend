import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})
export class CatalogComponent {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();
  filteredVideos: IVideo[] = [];
  filterTitle: string = '';

  constructor(private videoService: VideoService, private router: Router) {}

  ngOnInit(): void {
    this.findAll();
    this.filteredVideos = this.unbTvVideos;
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
        this.videoService.videosCatalog(this.unbTvVideos, this.catalog);
      },
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
      (this.filterTitle ? video.title?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true) ||
      (this.filterTitle ? video.description?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true) ||
      (this.filterTitle ? video.keywords?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true) ||
      (this.filterTitle ? video.catalog?.toLowerCase().includes(this.filterTitle.toLowerCase()) : true)
    );
  }

  onProgramClick(videos: IVideo[]) {
    this.videoService.setVideosCatalog(videos);
    this.router.navigate(['/videos']);
  }
}