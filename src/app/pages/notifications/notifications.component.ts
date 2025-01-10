import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { VideoService } from 'src/app/services/video.service';
import { IVideo } from 'src/shared/model/video.model';
import { AuthService } from 'src/app/services/auth.service';
import jwt_decode from 'jwt-decode';
import { UserService } from 'src/app/services/user.service';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { Catalog } from 'src/shared/model/catalog.model';
import { NotificationService } from 'src/app/services/notification.service';
import { EmailService } from 'src/app/services/email.service';
import { IEmailData } from 'src/shared/model/email.model';
import { find } from 'rxjs';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  unbTvVideos: IVideo[] = [];
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  userId: string = ''; 
  isAuthenticated: boolean = false; 
  recommendedVideos: IVideo[] = [];
  numberOfRecommendedVideos: number = 0;
  catalog: Catalog = new Catalog();
  notificationsRead: boolean = false;
  private lastVideoIds: number[]; 
  private checkInterval: any;  
  usuarios: [any];
  emailsNotificacao: string = '';
  email: IEmailData;
  videosList: IVideo[] = [];
videosExeção: IVideo[] = [
  {
    id: 1,
    title: "string",
    description: "string",
    keywords: "string",
    visibility: "string",
    duration: 0,
    generateLibras: true,
    generateSubtitle: true,
    qtAccess: 0,
    qtLikes: 0,
    images: undefined,
    embed: "string",
    channels: undefined,
    catalog: null,
    isFavorited: true,
    isWatchLater: true,
    showMenu: true
  }
];

  constructor(
    private videoService: VideoService,
    private authService: AuthService,
    private userService: UserService,
    private emailService: EmailService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.notificationsRead = localStorage.getItem('notificationsRead') === 'true';
    
    if (this.isAuthenticated) {
      this.setUserIdFromToken(localStorage.getItem('token') as string);
      await this.findAll();
      await this.fetchRecommendedVideos();  
      this.notificationService.fetchRecommendedVideosCount(this.userId);
      this.startCheckingForNewVideos();
    }
  }

  setUserIdFromToken(token: string) {
    const decodedToken: any = jwt_decode(token);
    this.userId = decodedToken.id;
  }

  fetchRecommendedVideos(): void {
    if (this.isAuthenticated) {
      const token = localStorage.getItem('token') as string;
      this.notificationService.setUserIdFromToken(token);
  
      this.notificationService.fetchRecommendedVideosCount(this.notificationService.userId)
        .subscribe({
          next: (response) => {
            if (response && Array.isArray(response.recommend_videos)) {
              const recommended_video_ids = response.recommend_videos.map((id: number) => String(id)); 
  
              this.recommendedVideos = this.unbTvVideos.filter(video => recommended_video_ids.includes(String(video.id))); 
            } else {
              console.warn('A estrutura da resposta da API não está conforme o esperado:', response);
            }
  
            console.log('Vídeos recomendados recebidos:', this.recommendedVideos);
            console.log(this.recommendedVideos[0]);
            this.numberOfRecommendedVideos = this.recommendedVideos.length;
          },
          error: (error) => {
            console.log('Erro ao buscar vídeos recomendados', error);
          }
        });
    }
  }
    
  markAsRead(): void {
    // Zera as notificações e atualiza a interface
    localStorage.setItem('notificationsRead', 'true');
    this.notificationsRead = true;
    this.recommendedVideos = [];
    this.numberOfRecommendedVideos = 0;

    // Atualiza o contador de notificações no serviço para 0
    this.notificationService.updateRecommendedVideosCount(0);

    // Força a atualização da interface
    this.cdr.detectChanges();
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

          // Verificar o conteúdo dos vídeos carregados
          console.log('Vídeos do canal UNB TV carregados:', this.unbTvVideos);

          resolve();
        },
      });
    });
  }

  startCheckingForNewVideos() {
    setInterval(() => {
      this.checkForNewVideos();
    }, 5 * 60 * 1000);  
  }

  private checkForNewVideos() {
    this.videoService.findAll().subscribe((videos) => {

    this.videosList = videos.body?.videoList ? videos.body?.videoList : this.videosExeção;

      const currentVideoIds = this.videosList.slice(0, 5).map((video) => video.id ? video.id : 0);

      const newVideos = this.getNewVideos(currentVideoIds);

      if (newVideos.length > 0) {
        this.userService.getAllUsers({}).subscribe((data) => {
          this.usuarios = data;

          this.usuarios.forEach(usuario => {
            this.emailsNotificacao = this.emailsNotificacao + usuario.email + ",";
          });
        })

         newVideos.forEach((video: number) => {

            this.email.descricao = "Olá, " + 
            "Estamos animados em te avisar que um novo vídeo foi lançado em nossa plataforma! 🎉" + 
            (videos.body?.videoList?.find(id => id == video)?.title ?? 'Título não encontrado');
        
            this.email.tema = `Assunto: 🎥 Novo Vídeo Disponível - ${videos.body?.videoList?.find(id => id == video)?.title ?? 'Título não encontrado'}`;
        
            this.email.email_contato = this.emailsNotificacao ?? 'contato@empresa.com';
         })

  


        this.emailService.sendEmail(this.email);
      }

      this.lastVideoIds = currentVideoIds;
    });
  }

  private getNewVideos(currentVideoIds: any[]){
    return currentVideoIds.filter(id => !this.lastVideoIds.includes(id));
  }

  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;

      if (channel && channel[0].id === this.unbTvChannelId) {
        this.unbTvVideos.push(video);
      }
    });
  }

  trackByVideoId(index: number, video: IVideo): string {
    return video.id ? video.id.toString() : index.toString();
  }
}
