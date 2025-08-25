import { IdentityNumberType } from "../../../declarations/backend/backend.did";

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

export function SignDocument(docString: string): string{
  return docString;
}

export const value2BigInt = (value: string) => {
    try {
        return value && value.trim() !== '' ? BigInt(value) : BigInt(0);
    } catch (error) {
        return BigInt(0);
    }
};


// export function VerifyDocument(chiper: string, privKey: string){}