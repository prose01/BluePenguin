import { Pipe, PipeTransform } from '@angular/core';
import { Group } from "./../core/group";
import { ChatParticipantType } from "./../core/chat-participant-type.enum";
import { IChatParticipant } from "./../core/chat-participant";
import { MessageModel } from '../../models/messageModel';

/*
 * Renders the display name of a participant in a group based on who's sent the message
*/
@Pipe({ name: 'groupMessageDisplayName' })
export class GroupMessageDisplayNamePipe implements PipeTransform {
  transform(participant: IChatParticipant, message: MessageModel): string {
    if (participant && participant.participantType.toString() == '1') {
      let group = participant as Group;
      let userIndex = group.chattingTo.findIndex(x => x.id == message.fromId);

      return group.chattingTo[userIndex >= 0 ? userIndex : 0].displayName;
    }
    else
      return "";
  }
}
