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
  recordVideos: any = {}; // Inicializado como um objeto vazio
  trackingEnabled: boolean = true; // Estado da checkbox de rastreamento


  constructor(private videoService: VideoService, private router: Router) {}


  async ngOnInit(): Promise<void> {
    this.setUserIdFromToken(localStorage.getItem('token') as string);
    this.checkTrackingStatus(); // Verifica o estado inicial do rastreamento
   
    if (this.trackingEnabled) {
        await this.checkRecord();
        await this.findAll();  
        this.filterVideosByRecord();
    } else {
        this.filteredVideos = []; // Se o rastreamento estiver desabilitado, não carregar os vídeos
    }
  }
 
  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }


  addToRecord(videoId: string): void {
    if (this.trackingEnabled) {
        this.videoService.addToRecord(this.userId, videoId).subscribe({
            next: (response) => {
                console.log('Video added to record:', response);
                this.checkRecord().then(() => this.filterVideosByRecord());
            },
            error: (err) => {
                if (err.status === 403) {
                    // Se o backend retornar 403, significa que o rastreamento está desabilitado
                    console.warn('Tracking is disabled. Video not added to record.');
                } else {
                    console.error('Error adding video to record', err);
                }
            }
        });
    } else {
        console.log('Tracking is disabled on frontend. Video not added to record.');
    }
  }


  checkTrackingStatus(): void {
    const storedTrackingStatus = localStorage.getItem('trackingEnabled');
   
    if (storedTrackingStatus !== null) {
        this.trackingEnabled = storedTrackingStatus === 'true';
    } else {
        this.trackingEnabled = true;
        this.saveTrackingStatus(); // Salva o estado padrão
    }
  }

  saveTrackingStatus(): void {
    localStorage.setItem('trackingEnabled', this.trackingEnabled.toString());
  }

  toggleTracking(enabled: boolean): void {
    this.trackingEnabled = enabled;
    this.saveTrackingStatus(); // Salva o estado atualizado


    this.videoService.toggleTracking(this.userId, enabled).subscribe({
        next: (response) => {
            console.log(response.message);


            if (!enabled) {
                // Se o rastreamento foi desabilitado, limpar os vídeos filtrados e o estado do histórico
                this.filteredVideos = [];
                this.recordVideos = {}; // Limpa o objeto de vídeos rastreados
            } else {
                // Se o rastreamento foi habilitado, recarregar o histórico
                this.checkRecord().then(() => this.filterVideosByRecord());
            }
        },
        error: (err) => {
            console.error('Error toggling tracking', err);
        }
    });
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
  if (this.recordVideos && this.recordVideos.videos && Object.keys(this.recordVideos.videos).length > 0) {
      console.log('Filtering videos with recordVideos:', this.recordVideos);
      const keys = Object.keys(this.recordVideos.videos).map(id => id.toString());
      console.log('Keys from recordVideos:', keys);
      console.log('All Videos:', this.unbTvVideos);


      this.filteredVideos = this.unbTvVideos.filter(video =>
          video.id !== undefined && keys.includes(video.id.toString()));


      console.log('Filtered Videos:', this.filteredVideos);
  } else {
      console.log('No recordVideos available or tracking is disabled');
      this.filteredVideos = []; // Se não houver vídeos no histórico ou se o rastreamento estiver desabilitado
  }
}


trackByVideoId(index: number, video: IVideo): string {
  return video.id ? video.id.toString() : index.toString();
}


sortRecord(ascending: boolean): void {
    console.log('Sorting records, ascending:', ascending);
    this.videoService.getRecordSorted(this.userId, ascending).subscribe({
        next: (response) => {
            console.log('Response from backend:', response.videos);


            this.recordVideos = { videos: response.videos };


            // Criação de uma nova lista de vídeos filtrados
            this.filteredVideos = [];
            const videoIds = Object.keys(this.recordVideos.videos);
            console.log('Video IDs from backend:', videoIds);


            // Mapeamento de IDs para os vídeos correspondentes
            videoIds.forEach(id => {
                const video = this.unbTvVideos.find(v => v.id?.toString() === id);
                if (video) {
                    this.filteredVideos.push(video);
                }
            });


            // Se não estiver em ordem ascendente, reverter a ordem dos vídeos
            if (!ascending) {
                this.filteredVideos.reverse();
            }


            console.log('Filtered videos after processing:', this.filteredVideos);
        },
        error: (err) => {
            console.error('Error sorting record:', err);
        }
    });
}




}
