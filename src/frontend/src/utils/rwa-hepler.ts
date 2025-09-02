import * as forge from 'node-forge';
import { IdentityNumberType, ReportType } from "../../../declarations/backend/backend.did";

export function ReduceCharacters(d: string, num: number = 20): string {
  if (d.length <= num) return d;
  return d.slice(0, num) + "....";
}

export function formatMotokoTime(nanoseconds: bigint) {
  const ms = Number(nanoseconds / 1000000n);
  return new Date(ms).toLocaleString("en-EN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
export function mapToIdentityNumberType(value: string): IdentityNumberType {
  switch (value) {
    case "IdentityNumber":
      return { IdentityNumber: null };
    case "LiscenseNumber":
      return { LiscenseNumber: null };
    case "Pasport":
      return { Pasport: null };
    default:
      throw new Error("Invalid id type");
  }
}

export function mapToReportType(value: string): ReportType {
  switch (value) {
    case "Fraud":
      return { Fraud: null };
    case "Plagiarism":
      return { Plagiarism: null };
    case "Legality":
      return { Legality: null };
    case "Bankrupting":
      return { Bankrupting: null };
    default:
      throw new Error("Invalid id type");
  }
}

export function SignDocument(docString: string): string {
  return docString;
}

export const value2BigInt = (value: string) => {
  try {
    return value && value.trim() !== '' ? BigInt(value) : BigInt(0);
  } catch (error) {
    return BigInt(0);
  }
};

export const CreatePairKey = (): [string, string] => {
  try {
    const keypair = forge.pki.rsa.generateKeyPair(2048);

    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    return [publicKeyPem, privateKeyPem];
    
  } catch (error) {
    console.error("Error generating key pair:", error);
    throw new Error("Failed to generate key pair");
  }
};

export const encryptWithPublicKey = (publicKeyPem: string, plainText: string): string => {
  const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);

  const encrypted = publicKey.encrypt(plainText, "RSA-OAEP", {
    md: forge.md.sha256.create(),
  });

  console.log(forge.util.encode64(encrypted));
  return forge.util.encode64(encrypted);
};

export const decryptWithPrivateKey = (privateKeyPem: string, encryptedBase64: string): string => {
  const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

  const decrypted = privateKey.decrypt(
    forge.util.decode64(encryptedBase64),
    "RSA-OAEP",
    {
      md: forge.md.sha256.create(),
    }
  );

  console.log(decrypted);
  return decrypted;
};