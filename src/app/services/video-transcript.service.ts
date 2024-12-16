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


  uploadFile(fileToUpload: File): Observable<any> {
    console.log("Ta chengado no uploadFile?")
    const formDataToUpload: FormData = new FormData();
    formDataToUpload.append('file', fileToUpload, fileToUpload.name);
    console.log("formDataToUpload", formDataToUpload.has('file'))
    return this.http.post(`${this.apiURLTranscript}/file-upload`, formDataToUpload) 
}
  handleError(e: any) {
    throw new Error('uploadFile Error');
  }

  getFile(file_id: any): Observable<any>{
    return this.http.get(`${this.apiURLTranscript}/file-upload/${file_id}`, {observe: 'response'})
  }
  
}