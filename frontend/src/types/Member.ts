export interface Member {
    _id: string;
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    isOwner: boolean;
    isAdmin: boolean;
    isTempUser: boolean;
}

export interface OverviewMembersListProps {
    members: Member[];
}

export interface MembersListProps{
    members: Member[];
    onClick: (arg0: boolean, arg1: string) => void;
}

export interface MemberInfoProps {
    member?: Member;
    memberUserId: string;
    confirmDelete: { id: string; confirm: boolean };
    handleRemoveMember: (memberId: string) => void;
    handleClose: () => void;
  }

 export interface MembersContainerProps {
    onClick: (arg0: boolean, arg1: string) => void;
    toggleInviteMenu: (show: boolean) => void;
  }