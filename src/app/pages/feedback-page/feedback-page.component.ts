import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';
import { FeedbackData, IFeedbackData } from 'src/shared/model/feedback.model';
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
    private feedbackService: FeedbackService,
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
      const feedbackData = new FeedbackData(
        this.feedbackForm.value.tema,
        this.feedbackForm.value.descricao,
        this.feedbackForm.value.emailContato || "",
        ['unbtv20241@gmail.com']
      );

      console.log("Enviando Feedback:", JSON.stringify(feedbackData, null, 2));

      this.isSendingEmail = true;

      this.feedbackService.sendFeedback(feedbackData).subscribe(
        (res: HttpResponse<string>) => {
          console.log("Resposta do backend:", res);
          this.alertService.showMessage("success", "Sucesso", "Feedback enviado com sucesso!");
          this.feedbackForm.reset();
          this.isSendingEmail = false; // Garante que o status é resetado no sucesso
        },
        (error: HttpErrorResponse) => {
          console.error('Erro ao enviar feedback:', error);
          this.alertService.showMessage("error", "Erro", 'Erro ao enviar: ' + error.message);
          this.isSendingEmail = false; // Agora também reseta em caso de erro
        }
      );
    } else {
      this.alertService.showMessage("info", "Alerta", "Preencha todos os campos corretamente!");
    }
  }
}
