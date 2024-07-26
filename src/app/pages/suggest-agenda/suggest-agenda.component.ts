import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'src/app/services/email.service';
import { EmailData } from 'src/shared/model/email.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert.service';
import { AbstractControl, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'app-suggest-agenda',
  templateUrl: './suggest-agenda.component.html',
  styleUrls: ['./suggest-agenda.component.css']
})
export class SuggestAgendaComponent implements OnInit {

  suggestAgendaForm!: FormGroup;
  isSendingEmail = false;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private alertService: AlertService,
  ) { }

  ngOnInit(): void {
    this.suggestAgendaForm = this.fb.group({
      tema: [''],
      descricao: ['', [Validators.required]],
      quando: [''],
      local: [''],
      responsavel: ['', [Validators.required]],
      telefoneResponsavel: ['', [Validators.required]],
      emailContato: ['', [Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
      urlVideo: ['', [this.validacaoUrl()]]
    },
    );
  }

  validacaoUrl(): ValidatorFn{
    return (control:AbstractControl):{[key: string]:any}| null => {
      if(control.value == ''){
        return null;
      }
      const padrao_url = /^(https:\/\/(?:www\.)?(youtube\.com|youtu\.be|drive\.google\.com|stream\.microsoft\.com|streamable\.com|vimeo\.com)\/.+)$/;
      const valido = padrao_url.test(control.value);
      return valido ? null : {url_invalida:{value:control.value}};
    }
  }


  sendSuggestAgenda(): void {
    if (this.suggestAgendaForm.valid) {
      const emailData = new EmailData();
      emailData.tema = this.suggestAgendaForm.value.tema;
      emailData.descricao = this.suggestAgendaForm.value.descricao;
      emailData.local = this.suggestAgendaForm.value.local;
      emailData.quando = this.suggestAgendaForm.value.quando;
      emailData.responsavel = this.suggestAgendaForm.value.responsavel;
      emailData.telefone_responsavel = this.suggestAgendaForm.value.telefoneResponsavel;
      emailData.email_contato = this.suggestAgendaForm.value.emailContato;
      emailData.url_video = this.suggestAgendaForm.value.urlVideo;
      const emailUnB = 'unbtv20241@gmail.com';
      emailData.recipients = [emailUnB];
      this.isSendingEmail = true;
      this.emailService.sendEmail(emailData).subscribe((res: HttpResponse<string>) => {
        this.alertService.showMessage("success", "Sucesso", "Sugestão enviada com sucesso");
      },
        (error: HttpErrorResponse) => {
          this.alertService.showMessage("error", "Erro", 'error: ' + error.message);
        },
        () => {
          this.isSendingEmail = false;
        });
    } else {
      if(this.suggestAgendaForm.controls['urlVideo'].errors?.['url_invalida']){
        this.alertService.showMessage("error", "Erro", "ERRO - A URL (endereço do vídeo) não é válida. Favor corrigir ou deletar.");
      }else{
        this.alertService.showMessage("info", "Alerta", "Preencha todos os campos corretamente!");
      }
    }
  }
}