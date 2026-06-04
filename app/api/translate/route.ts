import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const LIBRE_API = "https://libretranslate.com/translate";
const MYMEMORY_API = "https://api.mymemory.translated.net/get";

async function translateWithLibre(q: string, source: string, target: string) {
  const res = await fetch(LIBRE_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ q, source, target, format: "text" }),
  });
  if (!res.ok) throw new Error(`LibreTranslate: ${res.status}`);
  const data = await res.json();
  if (!data.translatedText) throw new Error("LibreTranslate: empty response");
  return data.translatedText;
}

async function translateWithMyMemory(q: string, target: string) {
  const langpair = `en|${target}`;
  const url = `${MYMEMORY_API}?q=${encodeURIComponent(q)}&langpair=${langpair}&de=d@bmbcodev.com`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`MyMemory: ${res.status}`);
  const data = await res.json();
  if (data.responseStatus !== 200 || !data.responseData?.translatedText) {
    throw new Error("MyMemory: empty response");
  }
  return data.responseData.translatedText;
}

export async function POST(req: NextRequest) {
  try {
    const { q, source, target } = await req.json();
    if (!q || !target) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let translatedText = "";
    try {
      translatedText = await translateWithLibre(q, source || "auto", target);
    } catch {
      try {
        translatedText = await translateWithMyMemory(q, target);
      } catch {
        return NextResponse.json(
          { error: "All translation services unavailable. Try again later." },
          { status: 503 }
        );
      }
    }

    return NextResponse.json({ translatedText });
  } catch {
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
