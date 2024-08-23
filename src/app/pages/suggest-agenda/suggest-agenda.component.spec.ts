import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { SuggestAgendaComponent } from './suggest-agenda.component';
import { AlertService } from 'src/app/services/alert.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';

const mockData = "email has been sent";
const mockError = new HttpErrorResponse({
  error: 'An error occurred',
  status: 500,
  statusText: 'Internal Server Error',
  url: '',
  headers: new HttpHeaders()
});

class EmailServiceMock {
  sendEmail() {
    return of(mockData);
  }
}

class AlertServiceMock {
  showMessage() {
    // Apenas um stub para o teste, não precisa fazer nada
  }
}

describe('SuggestAgendaComponent', () => {
  let component: SuggestAgendaComponent;
  let fixture: ComponentFixture<SuggestAgendaComponent>;
  let emailService: EmailService;
  let alertService: AlertService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuggestAgendaComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: EmailService, useValue: new EmailServiceMock() },
        { provide: AlertService, useValue: new AlertServiceMock() },
        MessageService
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SuggestAgendaComponent);
    component = fixture.componentInstance;
    emailService = TestBed.inject(EmailService);
    alertService = TestBed.inject(AlertService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a valid form on initialization', () => {
    fixture.detectChanges();
    expect(component.suggestAgendaForm).toBeTruthy();
  });

  it('should return null for valid phone numbers', () => {
    const validPhoneNumbers = [
      '(11) 91234-5678',
      '(41) 912345678',
      '(51)987654321',
      '21 98765-4321',
      '31923456789'
    ];

    validPhoneNumbers.forEach(phone => {
      const control = new FormControl(phone);
      const result = component.validacaoTelefone()(control);
      expect(result).toBeNull();
    });
  });

  it('should return an error object for invalid phone numbers', () => {
    const invalidPhoneNumbers = [
      '129567890',
      '(11) 1234-5678',
      '(21) 087654321',
      '98765-4321',
      'laskdjflkjas'
    ];

    invalidPhoneNumbers.forEach(phone => {
      const control = new FormControl(phone);
      const result = component.validacaoTelefone()(control);
      expect(result).toEqual({ telefone_invalido: { value: phone } });
    });
  });

  it('should call sendSuggestAgenda method when the form is submitted', () => {
    fixture.detectChanges();
    spyOn(component, 'sendSuggestAgenda').and.callThrough();
    const form = component.suggestAgendaForm;
    form.setValue({
      descricao: 'Descrição',
      responsavel: 'Usuário Teste',
      telefoneResponsavel: '999999999',
      tema: '',
      quando: '',
      local: '',
      emailContato: '',
      urlVideo: '',
    });

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    expect(component.sendSuggestAgenda).toHaveBeenCalled();
  });

  it('should call sendSuggestAgenda with invalid form', () => {
    fixture.detectChanges();
    spyOn(component, 'sendSuggestAgenda').and.callThrough();
    const form = component.suggestAgendaForm;
    form.setValue({
      descricao: '',
      responsavel: 'Usuário Teste',
      telefoneResponsavel: '999999999',
      tema: '',
      quando: '',
      local: '',
      emailContato: '',
      urlVideo: '',
    });

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    submitButton.click();

    expect(component.sendSuggestAgenda).toHaveBeenCalled();
  });

  it('should handle invalid URL error', () => {
    fixture.detectChanges();
    const alertSpy = spyOn(alertService, 'showMessage');
    const form = component.suggestAgendaForm;
    form.setValue({
      descricao: 'Descrição',
      responsavel: 'Usuário Teste',
      telefoneResponsavel: '(99) 99999-9999',
      tema: '',
      quando: '',
      local: '',
      emailContato: 'test@example.xxx',
      urlVideo: 'invalid-url'
    });
    component.sendSuggestAgenda();
    expect(alertSpy).toHaveBeenCalledWith('error', 'Erro', 'Serviços válidos: Youtube, Google Drive, Microsoft Stream, Streamable e Vimeo.');
  });
});