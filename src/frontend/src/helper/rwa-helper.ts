import { AssetStatus, AssetType, IdentityNumberType, KycStatus } from "../types/rwa";

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

export function getIdentityTypeText(identitytype: IdentityNumberType): string {
  if (!identitytype) return "Unknown";
  if ('IdentityNumber' in identitytype) return 'Identity Number';
  if ('LiscenseNumber' in identitytype) return 'Liscense Number';
  if ('Pasport' in identitytype) return 'Pasport';
  return 'Unknown';
}

export function getKYCSstatusText(kycstatus: KycStatus): string {
  if (!kycstatus) return "Unknown";
  if ('Rejected' in kycstatus) return 'Rejected';
  if ('Verivied' in kycstatus) return 'Verivied';
  if ('Pending' in kycstatus) return 'Pending';
  return 'Unknown';
}

export function isSameAssetType(a: AssetType, b: AssetType): boolean {
  const keyA = Object.keys(a)[0];
  const keyB = Object.keys(b)[0];
  return keyA === keyB;
}

export function formatMotokoTime(nanoseconds: bigint) : string {
  const ms = Number(nanoseconds / 1000000n);
  return new Date(ms).toLocaleString("en-EN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toString();
}