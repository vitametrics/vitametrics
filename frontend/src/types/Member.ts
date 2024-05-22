export interface Member {
    id: string;
    userId: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
    isOwner: boolean;
    isAdmin: boolean;
}

export interface OverviewMembersListProps {
    members: Member[];
}

export interface MembersListProps{
    members: Member[];
    onClick: (arg0: boolean, arg1: string) => void;
}

export interface MemberInfoProps {
    member: Member;
    userId: string;
    confirmDelete: { id: string; confirm: boolean };
    handleRemoveMember: (memberId: string) => void;
    handleClose: () => void;
  }