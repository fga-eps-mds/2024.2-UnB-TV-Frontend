import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeedbackPageComponent } from './feedback-page.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { FeedbackService } from 'src/app/services/feedback.service';
import { AlertService } from 'src/app/services/alert.service';
import { of, throwError } from 'rxjs';

describe('FeedbackPageComponent', () => {
  let component: FeedbackPageComponent;
  let fixture: ComponentFixture<FeedbackPageComponent>;
  let mockFeedbackService: jasmine.SpyObj<FeedbackService>;
  let mockAlertService: jasmine.SpyObj<AlertService>;

  beforeEach(async () => {
    mockFeedbackService = jasmine.createSpyObj('FeedbackService', ['sendFeedback']);
    mockAlertService = jasmine.createSpyObj('AlertService', ['showMessage']);

    await TestBed.configureTestingModule({
      declarations: [FeedbackPageComponent],
      imports: [ReactiveFormsModule],  
      providers: [
        FormBuilder,
        { provide: FeedbackService, useValue: mockFeedbackService },
        { provide: AlertService, useValue: mockAlertService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve enviar o feedback com sucesso', () => {
    mockFeedbackService.sendFeedback.and.returnValue(of('Feedback enviado com sucesso!'));

    component.feedbackForm.setValue({
      tema: 'Tema Teste',
      descricao: 'Descrição Teste',
      emailContato: 'teste@example.com'
    });

    component.sendFeedback();

    expect(mockFeedbackService.sendFeedback).toHaveBeenCalled();
    expect(mockAlertService.showMessage).toHaveBeenCalledWith(
      'success',
      'Sucesso',
      'Feedback enviado com sucesso!'
    );
  });

  it('deve exibir erro ao falhar no envio do feedback', () => {
    mockFeedbackService.sendFeedback.and.returnValue(throwError(() => new Error('Erro 500')));

    component.feedbackForm.setValue({
      tema: 'Tema Teste',
      descricao: 'Descrição Teste',
      emailContato: 'teste@example.com'
    });

    component.sendFeedback();

    expect(mockFeedbackService.sendFeedback).toHaveBeenCalled();
    expect(mockAlertService.showMessage).toHaveBeenCalledWith(
      'error',
      'Erro',
      'Erro ao enviar: Erro 500'
    );
  });

   it('deve exibir alerta se o formulário for inválido', () => {
    component.feedbackForm.setValue({
      tema: '', // Campo obrigatório vazio
      descricao: '',
      emailContato: 'email-invalido' // Formato de e-mail inválido
    });

    component.sendFeedback();

    expect(mockAlertService.showMessage).toHaveBeenCalledWith(
      'info',
      'Alerta',
      'Preencha todos os campos corretamente!'
    );

    expect(mockFeedbackService.sendFeedback).not.toHaveBeenCalled();
  });

  it('deve permitir envio de feedback sem emailContato', () => {
    mockFeedbackService.sendFeedback.and.returnValue(of('Feedback enviado com sucesso!'));

    component.feedbackForm.setValue({
      tema: 'Tema Teste',
      descricao: 'Descrição Teste',
      emailContato: '' // Deixando o e-mail em branco
    });

    component.sendFeedback();

    expect(mockFeedbackService.sendFeedback).toHaveBeenCalled();
    expect(mockAlertService.showMessage).toHaveBeenCalledWith(
      'success',
      'Sucesso',
      'Feedback enviado com sucesso!'
    );
  });
});
