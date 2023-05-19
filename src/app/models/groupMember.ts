export class GroupMember {
  profileId: string;
  name: string;
  blocked: boolean;
  complains: number;
}

export interface GroupMember {
  profileId: string;
  name: string;
  blocked: boolean;
  complains: number;
}
