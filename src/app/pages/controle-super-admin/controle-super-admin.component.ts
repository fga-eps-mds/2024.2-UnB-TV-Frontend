import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert.service';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { VideoService } from 'src/app/services/video.service';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-controle-super-admin',
  templateUrl: './controle-super-admin.component.html',
  styleUrls: ['./controle-super-admin.component.css'],
})
export class ControleSuperAdminComponent implements OnInit {
  users: any[] = [];
  loading: boolean = true;
  userId: number = 0;

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
    this.getUserid();
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
      this.confirmationService.confirm({
        message: 'Tem certeza que deseja excluir o perfil?',
        header: 'Confirmação',
        key: 'myDialog',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
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
        },
        reject: () => {},
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
  getUserid() {
    const decodedToken: any = jwt_decode(
      localStorage.getItem('token') as string
    );
    this.userId = decodedToken.id;
  }
  updateUserRole(id: number, role: string) {
    this.userService.updateUserRoleSuperAdmin(id, role).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (erro) => {
        console.error('Erro', erro);
        this.alertService.showMessage(
          'error',
          'Erro',
          "Usuário não pode receber essa role, por não ter 'unb' no email"
        );
        this.loadUsers();
      },
    });
  }
  onRoleChange(userId: number, event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const newRole = selectElement.value;

    this.updateUserRole(userId, newRole);
  }
}