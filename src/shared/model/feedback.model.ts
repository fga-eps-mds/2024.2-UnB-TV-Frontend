export interface IFeedbackData {
  tema: string;
  descricao: string;
  email_contato?: string;
  recipients?: string[];
}

export class FeedbackData implements IFeedbackData {
  constructor(
    public tema: string,
    public descricao: string,
    public email_contato: string = "",
    public recipients: string[] = []
  ) { }
}
