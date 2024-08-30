import { Component } from '@angular/core';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';

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
}
