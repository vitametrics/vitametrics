interface OverviewDevice {
    deviceId: string;
    deviceName: string;
    deviceVersion: string;
}


export interface OverviewMembersListProps {
    devices: OverviewDevice[];
}