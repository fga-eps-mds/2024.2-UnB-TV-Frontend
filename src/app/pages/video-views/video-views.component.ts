import { Component } from '@angular/core';
import { UNB_TV_CHANNEL_ID } from 'src/app/app.constant';
import { VideoService } from 'src/app/services/video.service';
import { VideoTranscriptService } from 'src/app/services/video-transcript.service';
import { AlertService } from 'src/app/services/alert.service';
import { Router } from '@angular/router';
import { environment } from '../../environment/environment';
import { HttpClient } from '@angular/common/http';
import { Catalog } from 'src/shared/model/catalog.model';
import { IVideo } from 'src/shared/model/video.model';
import { AuthService } from 'src/app/services/auth.service';
import { ConfirmationService } from 'primeng/api';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-video-views',
  templateUrl: './video-views.component.html',
  styleUrls: ['./video-views.component.css'],
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
  categories: string[] = [
    'Todas',
    'Arte e Cultura',
    'Documentais',
    'Entrevista',
    'Jornalismo',
    'Pesquisa e Ciência',
    'Séries Especiais',
    'UnBTV',
    'Variedades',
  ];

  sortAscending: boolean = true;
  isSorted: boolean = false;
  fileToUpload: File | any = null;

  fileName = 'DadosVideosUnBTV.xlsx';

  constructor(
    private videoService: VideoService,
    private authService: AuthService,
    private confirmationService: ConfirmationService,
    private videoTranscriptService: VideoTranscriptService,
    private alertService: AlertService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.findAll();
    this.filteredVideos = this.unbTvVideos;
    this.categories.forEach((category) => {
      this.selectedCategories[category] = true;
    });
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
        this.cleanDescriptions();
        this.filterVideos();
      },
    });
  }

  cleanDescriptions() {
    const cleanHtml = (html: string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent ?? '';
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
    let selectedCategories = Object.keys(this.selectedCategories).filter(
      (category) => this.selectedCategories[category]
    );

    if (selectedCategories.includes('Todas')) {
      this.categories.forEach((category) => {
        this.selectedCategories[category] = true;
      });
      this.filteredVideos = this.unbTvVideos;
    } else if (
      !selectedCategories.includes('Todas') &&
      this.selectedCategories['Todas'] === false &&
      selectedCategories.length === 8
    ) {
      this.categories.forEach((category) => {
        this.selectedCategories[category] = false;
      });
      this.filteredVideos = [];
    }

    selectedCategories = Object.keys(this.selectedCategories).filter(
      (category) => this.selectedCategories[category]
    );

    this.filteredVideos = this.unbTvVideos.filter(
      (video) =>
        (this.filterId ? video.id?.toString().includes(this.filterId) : true) &&
        (this.filterTitle
          ? video.title?.toLowerCase().includes(this.filterTitle.toLowerCase())
          : true) &&
        (this.filterDescription
          ? video.description
              ?.toLowerCase()
              .includes(this.filterDescription.toLowerCase())
          : true) &&
        selectedCategories.includes(video.catalog)
    );
    this.sortVideos();
  }

  sortVideos(): void {
    this.filteredVideos.sort((videoA, videoB) => {
      const accessA = videoA.qtAccess ?? 0;
      const accessB = videoB.qtAccess ?? 0;

      if (this.sortAscending) {
        return accessA - accessB;
      } else {
        return accessB - accessA;
      }
    });
  }

  changeSortOrder(): void {
    this.sortAscending = !this.sortAscending;
    this.sortVideos();
    this.isSorted = true;
  }
  // // Função de teste para uploade de arquivos
  // handleFileInput(files: Event) {
  //   const targetElement = event.target as HTMLElement;
  //   const form = targetElement.closest('form');
  //   const inputFile =
  //     form.querySelector<HTMLInputElement>('input[type="file"]');
  //   this.fileToUpload = inputFile.files[0];
  // }
  // uploadFileToActivity() {
  //   this.videoTranscriptService.uploadFile(this.fileToUpload).subscribe(data => {
  //     // do something, if upload success
  //     }, error => {
  //       console.log(error);
  //     });
  // }




  // fileUpload(event: Event, videoId: number): void {
  //   event.preventDefault(); // Evita o comportamento padrão, como recarregar a página.

  //   // Obtenha o botão ou elemento que disparou o evento.
  //   const targetElement = event.target as HTMLElement;

  //   // Procure o formulário mais próximo do botão ou elemento.
  //   const form = targetElement.closest('form');

  //   if (!form) {
  //     console.error('Formulário não encontrado.');
  //     this.alertService.showMessage(
  //       'Erro ao localizar o formulário. Por favor, tente novamente.',
  //       'error',
  //       'Erro no formulário'
  //     );
  //     return;
  //   }

  //   // Localize o campo de arquivo no formulário.
  //   const inputFile =
  //     form.querySelector<HTMLInputElement>('input[type="file"]');

  //   if (!inputFile || !inputFile.files || inputFile.files.length === 0) {
  //     this.alertService.showMessage(
  //       'Nenhum arquivo foi selecionado. Por favor, escolha um arquivo.',
  //       'warning',
  //       'Nenhum arquivo selecionado'
  //     );
  //     return;
  //   }
  //   console.log("Input file:", inputFile)
  //   const file = inputFile.files[0];
  //   console.log("File input:", file)
  //   // Validações de tipo e tamanho
  //   const maxFileSizeMB = 100; // 100 MB (ajuste conforme necessário)

  //   if (file.type !== 'text/plain') {
  //     this.alertService.showMessage(
  //       'Tipo de arquivo inválido. Apenas arquivos .txt são permitidos.',
  //       'error',
  //       'Tipo de arquivo inválido'
  //     );
  //     return;
  //   }

  //   if (file.size > maxFileSizeMB * 1024 * 1024) {
  //     this.alertService.showMessage(
  //       `O arquivo excede o tamanho máximo permitido de ${maxFileSizeMB} MB.`,
  //       'error',
  //       'Arquivo muito grande'
  //     );
  //     return;
  //   }

  //   // Prepare os dados para upload.
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   console.log("formData:", formData)
  //   formData.append('videoId', videoId.toString());
  //   console.log("chegou até aqui??")
  //   // Realiza o upload através do serviço.
  //   this.videoTranscriptService.uploadFile(formData).subscribe({
  //     next: (response) => {
  //       console.log('Upload realizado com sucesso:', response);
  //       this.alertService.showMessage(
  //         'Upload realizado com sucesso!',
  //         'success',
  //         'Upload concluído'
  //       );
  //       this.navigator('/file-upload');
  //     },
  //     error: (err) => {
  //       console.error('Erro ao realizar upload:', err);
  //       this.alertService.showMessage(
  //         'Erro ao realizar upload. Tente novamente.',
  //         'error',
  //         'Erro no upload'
  //       );
  //     },
  //   });
  // }

  // public apiURLTranscript = environment.videoAPIURL;

//   onFileUpload (event: Event) {
//     event.preventDefault(); // Evita o recarregamento da página.
//     const fileList: FileList = event.target.files;
//         if (fileList.length > 0) {
//           this.file = fileList[0];
//         }
      
//     Obtenha o formulário a partir do evento.
//     const form = event.target as HTMLFormElement;

//     Localize o input de arquivo dentro do formulário.
//     const input = form.querySelector<HTMLInputElement>('input[type="file"]');
    
//     if (input && input.files && input.files[0]) {
//       const file = input.files[0]

//     let testData:FormData = new FormData();
//     testData.append('file_upload', this., this.file.name);
//     this.http.post(`${this.apiURLTranscript}/file-upload`, testData).subscribe(response => {
//     console.log(response);
// });
//   }
  
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input?.files && input.files.length > 0){
      this.fileToUpload = input.files.item(0)
    } else {
      console.log(Error)
    }
  }  

  uploadFileToActivity() {
    console.log("Ta chegando até o uploadFileToActivity?")
    this.videoTranscriptService.uploadFile(this.fileToUpload).subscribe(
      {
        next: (data) => {
          console.log("Upload bem-sucedido!", data);
        },
        error: (error) => {
          console.error("Erro no upload:", error);
        },
      }
    );
  }

  onSubmit(event: Event): void {
    event.preventDefault(); // Evita o comportamento padrão de recarregar a página
    if (this.fileToUpload) {
      console.log('Enviando arquivo:', this.fileToUpload);
      // Lógica de envio do arquivo
      this.uploadFileToActivity()
    } else {
      console.error('Nenhum arquivo para enviar');
    }
  }

  
  // fileUpload(event: Event, video_id: number): void {
  //   event.preventDefault(); // Evita o recarregamento da página.

  //   // Obtenha o formulário a partir do evento.
  //   const form = event.target as HTMLFormElement;
  //   // Localize o input de arquivo dentro do formulário.
  //   const input = form.querySelector<HTMLInputElement>('input[type="file"]');
    
    
  //   if (input && input.files && input.files[0]) {
  //     const file = input.files[0];
  //     const formData = new FormData();
  //     console.log(file)
  
  //     formData.append('file', file); // Adiciona o arquivo ao FormData
  //     formData.append('videoId', video_id.toString()); // Adiciona o ID do vídeo ao FormData
  //     console.log("Formdata>>>", formData)
      
  //     this.videoTranscriptService.uploadFile(formData).subscribe({
  //       next: (response) => {
  //         console.log('Upload realizado com sucesso:', response);
  //         this.alertService.showMessage(
  //           'Upload realizado com sucesso!',
  //           'success',
  //           'Upload do arquivo feito com sucesso!'
  //         );
  //         this.navigator('/file-upload');
  //       },
  //       error: (err) => {
  //         console.error('Erro ao realizar upload:', err);
  //         this.alertService.showMessage(
  //           'Erro ao realizar upload. Tente novamente.',
  //           'error',
  //           'Erro no upload!'
  //         );
  //       },
  //     });
  //   } else {
  //     console.warn('Nenhum arquivo foi selecionado.');
  //     this.alertService.showMessage(
  //       'Por favor, selecione um arquivo antes de enviar.',
  //       'Selecione um arquivo!',
  //       'Select an input file!'
  //     );
  //   }
  // }

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

  exportExcel() {
    let data = document.getElementById('tabela-videos');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    const columnWidths = [
      { wch: 15 },
      { wch: 120 },
      { wch: 1200 },
      { wch: 20 },
      { wch: 20 },
    ];
    ws['!cols'] = columnWidths;
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }

  dummyKeyDown(event: KeyboardEvent): void {
    // Não faz nada
  }
  navigator(rota: string): void {
    this.router.navigate([rota]);
  }
}