import { Component, OnInit } from '@angular/core';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import { Router } from '@angular/router';
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
}
