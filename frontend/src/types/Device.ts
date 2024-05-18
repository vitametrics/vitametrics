interface OverviewDevice {
    id: string;
    name: string;
    deviceVersion: string;
}


export interface OverviewMembersListProps {
    devices: OverviewDevice[];
}