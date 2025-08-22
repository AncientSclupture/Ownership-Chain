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

export function SignDocument(docString: string): string{
  return docString;
}

// export function VerifyDocument(chiper: string, privKey: string){}