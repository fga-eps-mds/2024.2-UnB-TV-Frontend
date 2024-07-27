import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { IError } from 'src/shared/model/http-error.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationService, MessageService } from 'primeng/api';
import { VideoService } from 'src/app/services/video.service';

type ErrorResponseType = HttpErrorResponse;

  @Component({
    selector: 'app-home-admin',
    templateUrl: './home-admin.component.html',
    styleUrls: ['./home-admin.component.css']
  })
  export class HomeAdminComponent {
    
    constructor(
      private videoService: VideoService,
      private router: Router,
      private authService: AuthService,
      private confirmationService: ConfirmationService
    ) {};
  
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
      });}

  }

