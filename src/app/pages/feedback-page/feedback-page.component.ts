import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'src/app/services/email.service';
import { EmailData } from 'src/shared/model/email.model';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.html',
  styleUrls: ['./feedback-page.css']
})
export class FeedbackPageComponent implements OnInit {

  feedbackForm!: FormGroup;
  isSendingEmail = false;

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.feedbackForm = this.fb.group({
      tema: ['', [Validators.required]],
      descricao: ['', [Validators.required]],
      emailContato: ['', [Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')]],
    });
  }

  sendFeedback(): void {
    if (this.feedbackForm.valid) {
      const emailData = new EmailData();
      emailData.tema = this.feedbackForm.value.tema;
      emailData.descricao = this.feedbackForm.value.descricao;
      emailData.email_contato = this.feedbackForm.value.emailContato || "";
      const emailUnB = 'unbtv20241@gmail.com';
      emailData.recipients = [emailUnB];

      console.log("Enviando Feedback:", JSON.stringify(emailData, null, 2));

      this.isSendingEmail = true;
      this.emailService.sendEmail(emailData).subscribe(
        (res: HttpResponse<string>) => {
          this.alertService.showMessage("success", "Sucesso", "Feedback enviado com sucesso!");
          this.feedbackForm.reset();
        },
        (error: HttpErrorResponse) => {
          this.alertService.showMessage("error", "Erro", 'Erro ao enviar: ' + error.message);
        },
        () => {
          this.isSendingEmail = false;
        }
      );
    } else {
      this.alertService.showMessage("info", "Alerta", "Preencha todos os campos corretamente!");
    }
  }
}
