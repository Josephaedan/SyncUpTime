import type { APIContext } from "astro";

interface encryptedData {
  time: string;
}
const SECRET_KEY = import.meta.env.SECRET_KEY as string;
const CHAR_SET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_/|:";

function vigenereDecrypt(encryptedText: string, key: string) {
  const decodedText = decodeURIComponent(encryptedText.replace(/-/g, "."));
  const length = CHAR_SET.length;

  let decryptedText = "";
  for (let i = 0; i < decodedText.length; i++) {
    const charIndex = CHAR_SET.indexOf(decodedText[i]);
    if (charIndex !== -1) {
      decryptedText +=
        CHAR_SET[
          (charIndex - CHAR_SET.indexOf(key[i % key.length]) + length) % length
        ];
    } else {
      decryptedText += decodedText[i];
    }
  }
  return decryptedText;
}

export async function get({ request }: APIContext): Promise<Response> {
  // get search params from url
  const hash = new URL(request.url).searchParams.get("value");
  const decryptedData: string = vigenereDecrypt(hash ?? "", SECRET_KEY);
  const [datetime, timezone] = decryptedData.split("|");

  return new Response(JSON.stringify({ datetime, timezone }), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}
