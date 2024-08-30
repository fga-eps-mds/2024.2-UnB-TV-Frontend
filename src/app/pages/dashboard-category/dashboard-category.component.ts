import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-dashboard-category',
  templateUrl: './dashboard-category.component.html',
  styleUrls: ['./dashboard-category.component.css'],
})
export class DashboardCategoryComponent implements OnInit {
  @ViewChild('videoCountChart') videoCountChartRef: ElementRef;
  @ViewChild('totalViewsChart') totalViewsChartRef: ElementRef;
  @ViewChild('viewsPerVideoChart') viewsPerVideoChartRef: ElementRef;
  @ViewChild('videoCountChartPizza') videoCountChartPizzaRef: ElementRef;
  @ViewChild('totalViewsChartPizza') totalViewsChartPizzaRef: ElementRef;
  unbTvChannelId = UNB_TV_CHANNEL_ID;
  videosEduplay: IVideo[] = [];
  unbTvVideos: IVideo[] = [];
  aggregatedVideos: any[] = [];
  catalog: Catalog = new Catalog();
  categories: string[] = [
    "Arte e Cultura",
    "Documentais",
    "Entrevista",
    "Jornalismo",
    "Pesquisa e Ciência",
    "Séries Especiais",
    "UnBTV",
    "Variedades"
  ];

  viewsAllCategories: number = 0;
  videosAllCategories: number = 0;

  public categoryColors: { [key: string]: string } = {};
  public videoCountChartData: ChartData<'bar'>;
  public totalViewsChartData: ChartData<'bar'>;
  public viewsPerVideoChartData: ChartData<'bar'>;

  public chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  constructor(
    private videoService: VideoService,
    private authService: AuthService,
    private confirmationService: ConfirmationService
  ) {};
  
  ngOnInit(): void{
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
        this.videoService.videosCatalog(this.unbTvVideos, this.catalog);
        this.aggregateVideosByCategory();
      }
    })
  }

  filterVideosByChannel(videos: IVideo[]): void {
    videos.forEach((video) => {
      const channel = video?.channels;
      if ( channel )
        if ( channel[0].id === this.unbTvChannelId) this.unbTvVideos.push(video);
    });
  }

  aggregateVideosByCategory(): void{
    const categoryMap = new Map<string, { count: number, views: number, color: string }>();
    const categories = [
      "Arte e Cultura",
      "Documentais",
      "Entrevista",
      "Jornalismo",
      "Pesquisa e Ciência",
      "Séries Especiais",
      "UnBTV",
      "Variedades"
    ];

    const colors = [
      '#ADD8E6',
      '#FFB6C1',
      '#FF0000',
      '#FF9F40',
      '#90EE90',
      '#654321',
      '#800080',
      '#808080'
    ];

    categories.forEach((category, index) => {
      const color = colors[index % colors.length];
      categoryMap.set( category, { count: 0, views: 0, color: color });
      this.categoryColors[category] = color;
    });

    this.unbTvVideos.forEach((video) => {
      const category = video['catalog'];
      const views = video.qtAccess ?? 0;

      const categoryData = categoryMap.get(category);

      if ( categoryData ) {
        categoryData.count+= 1;
        categoryData.views+= views;
      }
      this.viewsAllCategories += views;
      this.videosAllCategories += 1;
    });

    this.aggregatedVideos = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      videoCount: data.count, 
      totalViews: data.views,
      viewsPerVideo: data.count > 0 ? data.views/data.count : 0,
      color: data.color
    }));
    this.createCharts(categoryMap);
  }

  createCharts(categoryMap: Map<string, { count: number, views: number, color: string }>): void {
    const categories = Array.from(categoryMap.keys());
    const videoCounts = Array.from(categoryMap.values()).map(data => data.count);
    const totalViews = Array.from(categoryMap.values()).map(data => data.views);
    const viewsPerVideo = Array.from(categoryMap.values()).map(data => data.count > 0 ? data.views/data.count : 0);
    const colors = Array.from(categoryMap.values()).map(data => data.color);
    const videoCountsPizza = Array.from(categoryMap.values()).map(data => ((data.count / this.videosAllCategories) * 100).toFixed(2));
    const totalViewsPizza = Array.from(categoryMap.values()).map(data => ((data.views / this.viewsAllCategories) * 100).toFixed(2));

    let graphVideoCountBar = new Chart(this.videoCountChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Quantidade de vídeos',
          data: videoCounts,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          }
        }
      }
    });

    let graphTotalViewsBar = new Chart(this.totalViewsChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Quantidade de visualizações',
          data: totalViews,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          }
        }
      }
    });

    let graphViewsPerVideoBar = new Chart(this.viewsPerVideoChartRef.nativeElement, {
      type: 'bar',
      data: {
        labels: categories,
        datasets: [{
          label: 'Visualizações por vídeo',
          data: viewsPerVideo,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            display: false
          }
        }
      }
    });
    
    let graphVideoCountPizza = new Chart(this.videoCountChartPizzaRef.nativeElement, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          label: 'Quantidade de vídeos',
          data: videoCountsPizza,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed;
                return `${value}%`;
              }
            }
          }
        },
        scales: {
          x: {
            display: false
          }
        }
      }
    });

    let graphTotalViewsPizza = new Chart(this.totalViewsChartPizzaRef.nativeElement, {
      type: 'pie',
      data: {
        labels: categories,
        datasets: [{
          label: 'Quantidade de visualizações',
          data: totalViewsPizza,
          backgroundColor: colors
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.parsed;
                return `${value}%`;
              }
            }
          }
        },
        scales: {
          x: {
            display: false
          }
        }
      }
    });
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
}