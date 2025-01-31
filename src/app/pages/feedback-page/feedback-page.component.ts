

import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback-page',
  templateUrl: './feedback-page.html',
  styleUrls: ['./feedback-page.css']
})
export class FeedbackPageComponent {
  constructor() {}

  ngOnInit(): void {
    console.log('Página de Feedback carregada.');
  }
/*
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Date;
  
  
  export const submitFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          ...feedback,
        });
      }, 1000);
    });

  };
}*/}
  