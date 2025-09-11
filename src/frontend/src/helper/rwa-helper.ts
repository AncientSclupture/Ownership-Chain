import { AssetStatus, AssetType } from "../types/rwa";

export function ReduceCharacters(d: string, num: number = 20): string {
  if (d.length <= num) return d;
  return d.slice(0, num) + "....";
}

export function getAssetStatusText(status: AssetStatus | undefined): string {
  if (!status) return "Unknown";
  if ('Open' in status) return 'Open For Sale';
  if ('Inactive' in status) return 'Inactive';
  if ('Active' in status) return 'Active';
  if ('Pending' in status) return 'Pending';
  return 'Unknown';
}


export function text2AssetType(status: string): AssetType {
  switch (status.toLowerCase()) {
    case "artwork":
      return { "Artwork": null }
    case "business":
      return { "Business": null }
    case "vehicle":
      return { "Vehicle": null }
    case "property":
      return { "Property": null }
    case "equipment":
      return { "Equipment": null }
    default:
      throw new Error(`Invalid asset status: ${status}`);
  }
}

export function text2AssetStatus(status: string): AssetStatus {
  switch (status.toLowerCase()) {
    case "open":
      return { "Open": null }
    case "inactive":
      return { "Inactive": null }
    case "active":
      return { "Active": null }
    case "pending":
      return { "Pending": null }
    default:
      throw null;
  }
}
export function isSameAssetType(a: AssetType, b: AssetType): boolean {
  const keyA = Object.keys(a)[0];
  const keyB = Object.keys(b)[0];
  return keyA === keyB;
}