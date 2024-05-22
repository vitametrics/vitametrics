/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OverviewDevice {
    deviceId: string;
    deviceName: string;
    deviceVersion: string;
}


export interface OverviewMembersListProps {
    devices: OverviewDevice[];
}

export interface DeviceListProps {
  devices: Device[];
}

export interface HeartData {
    dateTime: string;
    value: {
      customHeartRateZones: any[];
      heartRateZones: any[];
      restingHeartRate: number;
    };
  }
  export interface DeviceInfo {
    battery: string;
    batteryLevel: number;
    deviceVersion: string;
    features: string[];
    id: string;
  }
  
  export interface DataItem {
    dateTime: string;
    value: string;
  }
  
  export interface DeviceData {
    deviceId: string;
    deviceInfo: DeviceInfo;
    heartData: HeartData[];
    stepsData: DataItem[];
    floorsData: DataItem[];
    distanceData: DataItem[];
    elevationData: DataItem[];
    caloriesData: DataItem[];
  }
  
  export interface DeviceData {
    id: string;
    name: string;
    deviceVersion: string;
    lastSyncTime: string;
    batteryLevel: number;
    [key: string]: any; // This line is the index signature
  }
  
  export interface Device {
    deviceId: string;
    deviceName: string;
    deviceVersion: string;
    batteryLevel: number;
    lastSyncTime: string;
  }
  