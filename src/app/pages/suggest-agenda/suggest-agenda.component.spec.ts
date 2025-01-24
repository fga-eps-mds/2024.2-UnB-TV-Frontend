import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';
import { SuggestAgendaComponent } from './suggest-agenda.component';
import { AlertService } from 'src/app/services/alert.service';
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
      telefoneResponsavel: '999999999',
      tema: '',
      quando: '',
      local: '',
      emailContato: 'test@example.com',
      urlVideo: 'invalid-url'
    });
    component.sendSuggestAgenda();
    expect(alertSpy).toHaveBeenCalledWith('error', 'Erro', 'Serviços válidos: Youtube, Google Drive, Microsoft Stream, Streamable e Vimeo.');
  });

  it('should handle invalid phone number error', () => {
    fixture.detectChanges();
    const alertSpy = spyOn(alertService, 'showMessage');
    const form = component.suggestAgendaForm;
    form.setValue({
      descricao: 'Descrição',
      responsavel: 'Usuário Teste',
      telefoneResponsavel: '99999-9999',
      tema: '',
      quando: '',
      local: '',
      emailContato: 'test@example.com',
      urlVideo: 'https://www.youtube.com/watch?v=bX-8WWmW06Q'
    });
    component.sendSuggestAgenda();
    expect(alertSpy).toHaveBeenCalledWith('error', 'Erro', 'Telefone inválido.');
  });

  it('should send email successfully when the form is valid', () => {
    fixture.detectChanges();
    const alertSpy = spyOn(alertService, 'showMessage');
    const form = component.suggestAgendaForm;
    form.setValue({
      descricao: 'Descrição',
      responsavel: 'Usuário Teste',
      telefoneResponsavel: '999999999',
      tema: 'Tema',
      quando: 'Amanhã',
      local: 'Local',
      emailContato: 'test@example.com',
      urlVideo: 'https://www.youtube.com/watch?v=bX-8WWmW06Q'
    });

    component.sendSuggestAgenda();
    expect(alertSpy).toHaveBeenCalledWith('success', 'Sucesso', 'Sugestão enviada com sucesso');
  });

  it('should handle server error when sending email', () => {
    fixture.detectChanges();
    spyOn(emailService, 'sendEmail').and.returnValue(throwError(mockError));
    const alertSpy = spyOn(alertService, 'showMessage');
    const form = component.suggestAgendaForm;
    form.setValue({
      descricao: 'Descrição',
      responsavel: 'Usuário Teste',
      telefoneResponsavel: '999999999',
      tema: 'Tema',
      quando: 'Amanhã',
      local: 'Local',
      emailContato: 'test@example.com',
      urlVideo: 'https://www.youtube.com/watch?v=bX-8WWmW06Q'
    });
  
    component.sendSuggestAgenda();
    expect(alertSpy).toHaveBeenCalledWith(
      'error',
      'Erro',
      'error: Http failure response for (unknown url): 500 Internal Server Error'
    );
  });

  it('should show alert if form is invalid and no specific error message is present', () => {
    fixture.detectChanges();
    const alertSpy = spyOn(alertService, 'showMessage');
    const form = component.suggestAgendaForm;
    form.setValue({
      descricao: '',
      responsavel: '',
      telefoneResponsavel: '',
      tema: '',
      quando: '',
      local: '',
      emailContato: '',
      urlVideo: '',
    });

    component.sendSuggestAgenda();
    expect(alertSpy).toHaveBeenCalledWith('info', 'Alerta', 'Preencha todos os campos corretamente!');
  });
});
