export interface Member {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface OverviewMembersListProps {
    members: Member[];
}