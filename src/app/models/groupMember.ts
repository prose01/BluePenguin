export class GroupMember {
  profileId: string;
  name: string;
  blocked: boolean;
  complains: string[];
}

export interface GroupMember {
  profileId: string;
  name: string;
  blocked: boolean;
  complains: string[];
}
