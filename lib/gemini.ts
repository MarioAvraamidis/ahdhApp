import { GoogleGenAI,  createUserContent, createPartFromUri } from "@google/genai"

const ai = new GoogleGenAI({ apiKey: "AIzaSyAXdPmONpqOj5ItYG28ICTgyUBFj0wS2Tc" });

export async function runGemini(f: File, type: "Video" | "Audio" | "URL" ) {
    try {
        if (type === 'Video') {
            const myfile = await ai.files.upload({
                file: f,
                config: { mimeType: "video/mp4" },
            });

            let info = myfile;
            while (info.state !== "ACTIVE") {
                // tiny pause (2 s is usually enough for <100 MB files)
                await new Promise(r => setTimeout(r, 2000));
                console.log("File status:", info.state);
                // ask the service for the current status
                info = await ai.files.get({ name: info.name! });      // or info.refresh()
                if (info.state === "FAILED") {
                    throw new Error(`upload failed (${info.state})`);
                }
            }

            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: createUserContent([ // to make this function argument
                    createPartFromUri(myfile.uri!, myfile.mimeType!),
                    "Summarize this video",
                ]),
            });

            console.log(response.text);
            /*  If you want to show it in the UI, add a new piece
                of state (e.g. setSummary(resp.text)) here. */
        } else if (type === "Audio") {

        }
    } catch (err) {
      console.error("run gemini error:", err);
    }
}