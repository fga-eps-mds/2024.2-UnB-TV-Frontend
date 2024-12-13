import { Injectable } from '@angular/core';
import { environment } from '../environment/environment';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITranscript } from '../../shared/model/transcript.model';

@Injectable({
  providedIn: 'root',
})

export class VideoTranscriptService {
  public apiURLTranscript = environment.videoAPIURL;

  constructor(private http: HttpClient) {}

  uploadFile(body: FormData): Observable<any> {
    console.log("Body:", body)
    let response = this.http.post(`${this.apiURLTranscript}/file-upload`, body)
    console.log("uploadFile:", response)
    return this.http.post(`${this.apiURLTranscript}/file-upload`, body)
  }

//   uploadFile(fileToUpload: File): Observable<boolean> {
//     const endpoint = '${this.apiURLTranscript}/file-upload';
//     const formData: FormData = new FormData();
//     formData.append('fileKey', fileToUpload, fileToUpload.name);
//     return this.http
//       .post(endpoint, formData, { headers: new HttpHeaders() })
//       .catch((e) => this.handleError(e));
// }
  handleError(e: any) {
    throw new Error('Erro no uploadFile.');
  }

  getFile(file_id: any): Observable<any>{
    return this.http.get(`${this.apiURLTranscript}/file-upload/${file_id}`, {observe: 'response'})
  }
  
}