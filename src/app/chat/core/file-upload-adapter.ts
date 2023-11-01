import { Observable } from 'rxjs';
import { MessageModel } from '../../models/messageModel';
import { User } from './user';

export interface IFileUploadAdapter {
  uploadFile(file: File, participantId: any): Observable<MessageModel>;
}
