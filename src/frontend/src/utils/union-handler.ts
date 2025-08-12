import { AssetStatus, AssetType } from "../../../declarations/backend/backend.did";

export function getAssetStatusText(status: AssetStatus): string {
  if ('Open' in status) return 'Open';
  if ('Inactive' in status) return 'Inactive';
  if ('Active' in status) return 'Active';
  if ('Pending' in status) return 'Pending';
  return 'Unknown';
}

export function getAssetTypeText(type: AssetType): string {
  if ('Artwork' in type) return 'Artwork';
  if ('Business' in type) return 'Business';
  if ('Vehicle' in type) return 'Vehicle';
  if ('Property' in type) return 'Property';
  if ('Equipment' in type) return 'Equipment';
  if ('Other' in type) return type.Other;
  return 'Unknown';
}