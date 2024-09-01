import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';

@Component({
  selector: 'app-controle-super-admin',
  templateUrl: './controle-super-admin.component.html',
  styleUrls: ['./controle-super-admin.component.css'],
})
export class ControleSuperAdminComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;

  constructor(
    private videoService: VideoService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers({}).subscribe({
      next: (response: any) => {
        console.log('API response:', response);
        this.users = response.body;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error loading users:', error);
        this.loading = false;
        this.alertService.errorMessage(error);
      },
    });
  }

  deleteUser(userId: any) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.alertService.showMessage(
          'success',
          'Sucesso',
          'Usuário excluído com sucesso.'
        );
        this.loadUsers(); // Recarrega a lista de usuários após exclusão
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting user:', error);
        this.alertService.errorMessage(error);
      },
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
