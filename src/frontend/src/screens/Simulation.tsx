import React from "react";

// Utility: export key to PEM string
async function exportKey(key: CryptoKey, type: "private" | "public"): Promise<string> {
  const exported = await crypto.subtle.exportKey(type === "private" ? "pkcs8" : "spki", key);
  const exportedAsString = String.fromCharCode(...new Uint8Array(exported));
  const exportedAsBase64 = btoa(exportedAsString);
  const pemHeader = type === "private" ? "PRIVATE KEY" : "PUBLIC KEY";
  const pem = `-----BEGIN ${pemHeader}-----\n${exportedAsBase64.match(/.{1,64}/g)?.join("\n")}\n-----END ${pemHeader}-----`;
  return pem;
}

// Utility: import PEM back to CryptoKey
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

// Utility: download text file
function downloadFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

function Simulation() {
  const [signature, setSignature] = React.useState<string | null>(null);
  const [verifyResult, setVerifyResult] = React.useState<boolean | null>(null);

  // SECTION 1: Generate & Download Key Pair
  const generateKeys = async () => {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["sign", "verify"]
    );

    const privatePem = await exportKey(keyPair.privateKey, "private");
    const publicPem = await exportKey(keyPair.publicKey, "public");

    downloadFile("private.pem", privatePem);
    downloadFile("public.pem", publicPem);
    downloadFile("private.txt", privatePem);
    downloadFile("public.txt", publicPem);
    alert("Private & Public key berhasil di-generate dan di-download!");
  };

  // SECTION 2: Sign Document
  const signDocument = async (file: File, privatePemFile: File) => {
    const privatePem = await privatePemFile.text();
    const privateKey = await importKey(privatePem, "private");

    const arrayBuffer = await file.arrayBuffer();
    const signatureBuffer = await crypto.subtle.sign(
      { name: "RSASSA-PKCS1-v1_5" },
      privateKey,
      arrayBuffer
    );

    const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signatureBuffer)));
    setSignature(signatureBase64);
  };

  // SECTION 3: Verify Document
  const verifyDocument = async (file: File, publicPemFile: File, signatureBase64: string) => {
    const publicPem = await publicPemFile.text();
    const publicKey = await importKey(publicPem, "public");

    const arrayBuffer = await file.arrayBuffer();
    const signatureBytes = Uint8Array.from(atob(signatureBase64), (c) => c.charCodeAt(0));

    const valid = await crypto.subtle.verify(
      { name: "RSASSA-PKCS1-v1_5" },
      publicKey,
      signatureBytes,
      arrayBuffer
    );
    setVerifyResult(valid);
  };

  // Refs untuk input file
  const signPdfRef = React.useRef<HTMLInputElement | null>(null);
  const signKeyRef = React.useRef<HTMLInputElement | null>(null);

  const verifyPdfRef = React.useRef<HTMLInputElement | null>(null);
  const verifyKeyRef = React.useRef<HTMLInputElement | null>(null);
  const signatureRef = React.useRef<HTMLTextAreaElement | null>(null);

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">🔐 Digital Signature Simulation</h1>

      {/* SECTION 1 */}
      <section className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">1️⃣ Generate & Download Keys</h2>
        <button
          onClick={generateKeys}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Generate & Download Keys
        </button>
      </section>

      {/* SECTION 2 */}
      <section className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">2️⃣ Sign Document</h2>
        <input type="file" accept="application/pdf" ref={signPdfRef} className="block mb-2" />
        <input type="file" accept=".pem" ref={signKeyRef} className="block mb-2" />
        <button
          onClick={() => {
            const pdf = signPdfRef.current?.files?.[0];
            const key = signKeyRef.current?.files?.[0];
            if (pdf && key) signDocument(pdf, key);
          }}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Sign PDF
        </button>

        {signature && (
          <div className="mt-4">
            <p><strong>Signature (Base64):</strong></p>
            <textarea
              ref={signatureRef}
              className="w-full p-2 border rounded"
              rows={4}
              value={signature}
              readOnly
            />
          </div>
        )}
      </section>

      {/* SECTION 3 */}
      <section className="p-4 border rounded">
        <h2 className="text-lg font-semibold mb-2">3️⃣ Verify Document</h2>
        <input type="file" accept="application/pdf" ref={verifyPdfRef} className="block mb-2" />
        <input type="file" accept=".pem" ref={verifyKeyRef} className="block mb-2" />
        <textarea
          placeholder="Paste signature Base64 here"
          ref={signatureRef}
          className="w-full p-2 border rounded mb-2"
          rows={3}
          defaultValue={signature || ""}
        />
        <button
          onClick={() => {
            const pdf = verifyPdfRef.current?.files?.[0];
            const key = verifyKeyRef.current?.files?.[0];
            const sig = signatureRef.current?.value;
            if (pdf && key && sig) verifyDocument(pdf, key, sig);
          }}
          className="px-4 py-2 bg-purple-600 text-white rounded"
        >
          Verify PDF
        </button>

        {verifyResult !== null && (
          <p className="mt-2 font-bold">
            Hasil Verifikasi: {verifyResult ? "✅ Valid" : "❌ Tidak Valid"}
          </p>
        )}
      </section>
    </div>
  );
}

export default Simulation;
