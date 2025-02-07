import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IFeedbackData } from 'src/shared/model/feedback.model';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private feedbackAPIUrl = environment.apiURL + '/feedback/email'; 

  constructor(private http: HttpClient) { }

  sendFeedback(feedback: IFeedbackData): Observable<any> {
    return this.http.post(this.feedbackAPIUrl, feedback);
  }
}
