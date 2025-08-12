export enum AssetTypeOptions {
  Artwork = 'Artwork',
  Business = 'Business',
  Vehicle = 'Vehicle',
  Property = 'Property',
  Other = 'Other',
  Equipment = 'Equipment',
  All = "All"
};

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