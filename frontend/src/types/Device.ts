/* eslint-disable @typescript-eslint/no-explicit-any */
export interface OverviewDevice {
    deviceId: string;
    deviceName: string;
    deviceVersion: string;
    batteryLevel: number;
    lastSyncTime: string;
}


export interface OverviewMembersListProps {
    devices: OverviewDevice[];
}

export interface DeviceListProps {
  devices: Device[];
  onDeviceClick: (deviceId: string) => void;
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
    deviceId: string;
    deviceName: string;
    deviceVersion: string;
    lastSyncTime: string;
    batteryLevel: number;
    [key: string]: any; // This line is the index signature
  }
  
  export interface Device {
    deviceId: string;
    deviceName: string;
    ownerName: string;
    deviceVersion: string;
    batteryLevel: string;
    lastSyncTime: string;
  }
  
  

  export interface ProjectDevice{
    _id: string,
    projectId: string,
    deviceName: string,
    deviceVersion: string,
    batteryLevel: string,
    deviceId: string,
    lastSyncTime: string,
  }