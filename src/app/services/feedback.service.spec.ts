import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FeedbackService } from './feedback.service';
import { IFeedbackData } from 'src/shared/model/feedback.model';
import { environment } from '../environment/environment';

describe('FeedbackService', () => {
  let service: FeedbackService;
  let httpMock: HttpTestingController;
  const feedbackAPIUrl = environment.apiURL + '/feedback/email';

  const mockFeedback: IFeedbackData = {
    tema: 'Teste',
    descricao: 'Descrição do feedback',
    email_contato: 'teste@example.com',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FeedbackService],
    });

    service = TestBed.inject(FeedbackService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve ser criado', () => {
    expect(service).toBeTruthy();
  });

  it('deve enviar feedback corretamente', () => {
    service.sendFeedback(mockFeedback).subscribe(response => {
      expect(response).toEqual({ success: true });
    });

    const req = httpMock.expectOne(feedbackAPIUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ success: true });
  });

});
