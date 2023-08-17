import type { APIContext } from "astro";

const SECRET_KEY = import.meta.env.SECRET_KEY as string;

export const prerender = false;

interface formData {
  datetime: string;
  timezone: string;
}

const CHAR_SET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_/|:";

function vigenereEncrypt(plainText: string, key: string) {
  const length = CHAR_SET.length;

  let encryptedText = "";
  for (let i = 0; i < plainText.length; i++) {
    const charIndex = CHAR_SET.indexOf(plainText[i]);
    if (charIndex !== -1) {
      encryptedText +=
        CHAR_SET[(charIndex + CHAR_SET.indexOf(key[i % key.length])) % length];
    } else {
      encryptedText += plainText[i];
    }
  }
  return encodeURIComponent(encryptedText).replace(/\./g, "-");
}

const formatDataToString = ({ datetime, timezone }: formData) => {
  return `${datetime}|${timezone}`;
};

export async function post({ request }: APIContext): Promise<Response> {
  const data: formData = await request.json();
  const dataString = formatDataToString(data);
  const encryptedData = vigenereEncrypt(dataString, SECRET_KEY);

  return new Response(JSON.stringify(encryptedData), {
    headers: { "content-type": "application/json" },
    status: 200,
  });
}
