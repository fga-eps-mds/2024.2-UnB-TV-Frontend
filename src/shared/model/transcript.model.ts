export interface ITranscript {
    id?: number;
    video_id?: number;
    content?: string;
    created_at?: Date;
}

export class Transcript implements ITranscript {
    constructor (
        public id?: number,
        public video_id?: number,
        public content?: string,
        public created_at?: Date
    ) { }
}