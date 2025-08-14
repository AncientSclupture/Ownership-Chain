import { LucideIcon } from "lucide-react";

export enum AssetTypeOptions {
  Artwork = 'Artwork',
  Business = 'Business',
  Vehicle = 'Vehicle',
  Property = 'Property',
  Other = 'Other',
  Equipment = 'Equipment',
  All = "All"
};

export enum SpecificAssetOverview {
  Overview = "Overview",
  Token = "Token",
  Dividend = "Dividend",
  AccessInfo = "Access Info",
}

export enum ShowAssetoption {
  card = 'card',
  list = 'list',
}

export interface FilterState {
  searchQuery: string;
  selectedAssetTypes: string[];
}

export interface SearchCompProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

export interface AssetTypeFilterTabProps {
  selectedTypes: string[];
  onTypeChange: (types: string[]) => void;
}

export interface LoaderProps {
  size?: number;
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export enum UserDashboardMenus {
  AboutMe = "About Me",
  AssetsList = "Assets List",
  Proposals = "Proposals",
  CreateAsset = "Create Asset",
  Income = "Income",
  MyReport = "My Reports",
  Ownership = "Ownership"
}

export interface UserDashboardSubMenusInterface {
  name: string;
  usermenu: UserDashboardMenus;
  icon?: LucideIcon;
}

export interface UserDashboardMenusInterface {
  name: string;
  usermenu?: UserDashboardMenus;
  icon?: LucideIcon;
  submenu: UserDashboardSubMenusInterface[];
}