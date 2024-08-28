import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { IError } from 'src/shared/model/http-error.model';
import { HttpErrorResponse } from '@angular/common/http';

type ErrorResponseType = HttpErrorResponse;

@Component({
  selector: 'app-super-admin-activate',
  templateUrl: './super-admin-activate.component.html',
  styleUrls: ['./super-admin-activate.component.css'],
})
export class SuperAdminActivateComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe({
      next: (params: any) => {
        const email = params['email'];
        if (email) {
          this.setupSuperAdmin(email);
        } else {
          const error: IError = { message: 'Email não fornecido' };
          this.alertService.errorMessage(error);
          this.router.navigate(['/loginsocial']);
        }
      },
      error: (error: ErrorResponseType) => {
        const errorMsg: IError = {
          message: error.error.detail || 'Erro ao obter parâmetros da URL',
        };
        this.alertService.errorMessage(errorMsg);
        this.router.navigate(['/loginsocial']);
      },
    });
  }

  setupSuperAdmin(email: string): void {
    const data = { email: email };

    this.authService.super_admin_setup(data).subscribe({
      next: () => {
        this.alertService.showMessage(
          'success',
          'Sucesso',
          'Super Admin configurado com sucesso!'
        );
        this.alertService.showMessage(
          'info',
          'Alerta',
          'Saia da sua conta e entre novamente para acessar a tela de administrador.'
        );
        this.router.navigate(['/homeAdmin']);
      },
      error: (error: ErrorResponseType) => {
        const errorMsg: IError = {
          message: error.error.detail || 'Erro desconhecido',
        };
        this.alertService.errorMessage(errorMsg);
        this.router.navigate(['/loginsocial']);
      },
    });
  }
}
