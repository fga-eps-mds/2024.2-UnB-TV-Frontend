import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();
  filteredVideos: IVideo[] = [];
  filterTitle: string = '';
  userId: string = '';
  recordVideos: any;

  constructor(private videoService: VideoService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.setUserIdFromToken(localStorage.getItem('token') as string);
    await this.checkRecord(); 
    await this.findAll();  
    this.filterVideosByRecord();
  }
  
  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }

  checkRecord(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.videoService.checkRecord(this.userId.toString()).subscribe({
        next: (response) => {
          this.recordVideos = response;
          resolve();
        },
        error: (err) => {
          console.error('Error checking record', err);
          reject(err);
        }
      });
    });
  }

  findAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.videoService.findAll().subscribe({
        next: (data) => {
          this.videosEduplay = data.body?.videoList ?? [];
        },
        error: (error) => {
          console.log(error);
          reject(error);
        },
        complete: () => {
          this.filterVideosByChannel(this.videosEduplay);
          this.videoService.videosCatalog(this.unbTvVideos, this.catalog);
          resolve();
        },
      });
    });
  }
  
  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;

      if (channel)
        if (channel[0].id === this.unbTvChannelId) this.unbTvVideos.push(video);
    });
  }

  filterVideosByRecord(): void {
    const keys = Object.keys(this.recordVideos.videos).map(id => parseInt(id, 10))
    this.filteredVideos = this.unbTvVideos.filter(video => video.id !== undefined && keys.includes(video.id));
  }
}
