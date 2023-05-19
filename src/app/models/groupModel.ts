import { GroupMember } from './groupMember';
import { AvatarModel } from './AvatarModel'

export class GroupModel {
  groupId: string;
  createdOn: Date;
  name: string;
  description: string;
  avatar: AvatarModel;
  countrycode: string;
  groupMemberslist: Array<GroupMember>;
}

export interface GroupModel {
  groupId: string;
  createdOn: Date;
  name: string;
  description: string;
  avatar: AvatarModel;
  countrycode: string;
  groupMemberslist: Array<GroupMember>;
}
