import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IVideo } from 'src/shared/model/video.model';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { Catalog } from 'src/shared/model/catalog.model';
import jwt_decode from 'jwt-decode';
import { UserService } from '../../services/user.service';
import { VideoService } from '../../services/video.service';


@Component({
  selector: 'app-recommendation-videos',
  templateUrl: './recommendation-videos.component.html',
  styleUrls: ['./recommendation-videos.component.css']
})
export class RecommendationVideosComponent implements OnInit {
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  catalog: Catalog = new Catalog();
  userId: string; 
  user: any;
  recommendVideos: IVideo[] = [];

  constructor(
    private userService: UserService,
    private videoService: VideoService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.setUserIdFromToken(localStorage.getItem('token') as string);
    try {
      await this.findAll(); 
      this.getUserDetails(); 
    } catch (error) {
      console.error('Erro ao buscar os vídeos:', error);
    }
  }

  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }
 
  getUserDetails() {
    this.userService.getUser(this.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.recommendVideosByRecord();
      },
      error: (err) => {
        console.error('Error fetching user details', err);
      }
    });
  }

  recommendVideosByRecord() {
    this.videoService.getRecommendationFromRecord(this.userId.toString()).subscribe({
      next: (response) => {
        const videosID = Object.values(response.recommend_videos).map(id => (id as number).toString());
        
        this.recommendVideos = this.unbTvVideos.filter(video => videosID.includes(String(video.id))); 
      },
      error: (err) => {
      }
    });
  }

  findAll(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.videoService.findAll().subscribe({
        next: (data) => {
          this.videosEduplay = data.body?.videoList ?? [];
          this.filterVideosByChannel(this.videosEduplay);
          this.videoService.videosCatalog(this.unbTvVideos, this.catalog);
          resolve(); 
        },
        error: (error) => {
          console.log(error);
          reject(error); 
        }
      });
    });
  }
  
  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;
      if (channel && channel[0].id === this.unbTvChannelId) {
        this.unbTvVideos.push(video);
      }
    });
  }
}