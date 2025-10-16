import { AssetStatus, AssetType, ComplaintType, TransactionStatus, TransactionType, TresuryType } from "../types/rwa";
import type { Principal } from '@dfinity/principal';

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

export function getAssetTypeText(assettype: AssetType | undefined): string {
  if (!assettype) return "Unknown";
  if ('Digital' in assettype) return 'Digital';
  if ('Physical' in assettype) return 'Physical';
  if ('Hybrid' in assettype) return 'Hybrid';
  return 'Unknown';
}

export function getTreasuryLedgerText(treasuryledger: TresuryType | undefined): string {
  if (!treasuryledger) return "Unknown";
  if ('AssetSupport' in treasuryledger) return 'AssetSupport';
  if ('Donepayment' in treasuryledger) return 'Donepayment';
  return 'Unknown';
}

export function getTransactionText(assettype: TransactionType | undefined): string {
  if (!assettype) return "Unknown";
  if ('Dividend' in assettype) return 'Dividend';
  if ('Buy' in assettype) return 'Buy';
  if ('Supportasset' in assettype) return 'Supportasset';
  if ('Liquidation' in assettype) return 'Liquidation';
  if ('Transfer' in assettype) return 'Transfer';
  if ('Donepayment' in assettype) return 'Donepayment';
  if ('DonepaymentCashback' in assettype) return 'DonepaymentCashback';
  return 'Unknown';
}

export function getTransactionStatusText(transactionstatus: TransactionStatus | undefined): string {
  if (!transactionstatus) return "Unknown";
  if ('Done' in transactionstatus) return 'Done';
  if ('Cancled' in transactionstatus) return 'Cancled';
  if ('Progress' in transactionstatus) return 'Progress';
  return 'Unknown';
}

export function text2AssetType(status: string): AssetType {
  switch (status) {
    case "Digital":
      return { "Digital": null }
    case "Physical":
      return { "Physical": null }
    case "Hybrid":
      return { "Hybrid": null }
    default:
      throw new Error(`Invalid asset status: ${status}`);
  }
}

export function text2AssetStatus(status: string): AssetStatus {
  switch (status.toLowerCase()) {
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


export function getReportTypeText(value: ComplaintType): string {
  if (!value) return "Unknown";
  if ('Fraud' in value) return 'fraud';
  if ('Plagiarism' in value) return 'plagiarism';
  return 'Unknown';
}

export function isSameAssetType(a: AssetType, b: AssetType): boolean {
  const keyA = Object.keys(a)[0];
  const keyB = Object.keys(b)[0];
  return keyA === keyB;
}

export function formatMotokoTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1000000n);
  return new Date(ms).toLocaleString("en-EN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toString();
}

export function formatMotokoTimeSpecific(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1000000n);
  return new Date(ms).toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(",", "");
}

export function calculateTotalVotes(votes: Array<[Principal, number]>): number {
  return votes.reduce((total, [_, voteCount]) => total + voteCount, 0);
}

export async function exportKey(key: CryptoKey, type: "private" | "public"): Promise<string> {
  const exported = await crypto.subtle.exportKey(type === "private" ? "pkcs8" : "spki", key);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = btoa(exportedAsString);
  const pemHeader = type === "private" ? "PRIVATE KEY" : "PUBLIC KEY";
  const pem = `-----BEGIN ${pemHeader}-----\n${exportedAsBase64.match(/.{1,64}/g)?.join("\n")}\n-----END ${pemHeader}-----`;
  return pem;
}

async function importKey(pem: string, type: "private" | "public"): Promise<CryptoKey> {
  const pemHeader = type === "private" ? "PRIVATE KEY" : "PUBLIC KEY";
  const pemContents = pem.replace(`-----BEGIN ${pemHeader}-----`, "")
    .replace(`-----END ${pemHeader}-----`, "")
    .replace(/\s/g, "");
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  return crypto.subtle.importKey(
    type === "private" ? "pkcs8" : "spki",
    binaryDer,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    true,
    type === "private" ? ["sign"] : ["verify"]
  );
}

export function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

export const signDocument = async (file: File, privatePemFile: File) => {
  const privatePem = await privatePemFile.text();
  const privateKey = await importKey(privatePem, "private");

  const arrayBuffer = await file.arrayBuffer();
  const signatureBuffer = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    privateKey,
    arrayBuffer
  );

  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
  return signatureBase64;
};

export async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}

export const verifyDocument = async (file: File, publicPemFile: string, signatureBase64: string): Promise<boolean> => {
  const publicKey = await importKey(publicPemFile, "public");

  const arrayBuffer = await file.arrayBuffer();
  const signatureBytes = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));

  const valid = await crypto.subtle.verify(
    { name: "RSASSA-PKCS1-v1_5" },
    publicKey,
    signatureBytes,
    arrayBuffer
  );
  return valid;
};
