import { GoogleGenAI,  createUserContent, createPartFromUri } from "@google/genai"
import { GoogleGenerativeAI } from "@google/generative-ai"
export let summaryText: string | null = null;
export let title: string | null = null;

const genAI = new GoogleGenerativeAI("AIzaSyAXdPmONpqOj5ItYG28ICTgyUBFj0wS2Tc");
const ai = new GoogleGenAI({ apiKey: "AIzaSyAXdPmONpqOj5ItYG28ICTgyUBFj0wS2Tc" });

const audio_prompt = "Give a short title in the first line.Then add two line breaks.Then please summarize the audio file in 3 sentences. After the summary, add 2 empty lines and then show in separate paragraphs the most needed keypoints. Each keypoint should be 1 sentence. Your output should be a continuous text. Don't use latex in your output, nor titles for keypoints. Only simple text";
const video_prompt = "Give a short title for the video in the first line.Then add two line breaks.Then please summarize the video in 3 sentences. After the summary, add 2 empty lines and then show in separate paragraphs the most needed  keypoints. Each keypoint should be 1 sentence. Your output should be a continuous text. Don't use latex in your output, nor titles for keypoints. Only simple text";

export async function runGemini(input: File | string, type: "Video" | "Audio" | "YouTube"|"URL"| "Text") {
    try {
        if (type === 'Video') {
            const myfile = await ai.files.upload({
                file: input,
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
                model: "gemini-2.5-pro-preview-06-05",
                contents: createUserContent([ // to make this function argument
                    createPartFromUri(myfile.uri!, myfile.mimeType!),
                    video_prompt,
                ]),
            });

            console.log(response.text);
            return response.text;
            /*  If you want to show it in the UI, add a new piece
                of state (e.g. setSummary(resp.text)) here. */
        } else if (type === "Audio") {
            const myfile = await ai.files.upload({
                file: input,
                config: { mimeType: "audio/mp3" },
            });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-pro-preview-06-05",
                contents: createUserContent([
                    createPartFromUri(myfile.uri!, myfile.mimeType!),
                    audio_prompt,
                ]),
            });
        console.log(response.text);
        return response.text;
    
        }else if (type === "YouTube") {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-06-05" });
            const result = await model.generateContent([
                video_prompt,
                {
                    fileData: {
                        fileUri: input as string,
                        mimeType: ""
                    },
                },
            ]);
            return result.response.text();
        } else if (type === "URL") {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-06-05" });
            const result = await model.generateContent([
               "Give a short title for the content of the URL in the first line.Then add two line breaks.Then please summarize the contents in 3 sentences. After the summary, add 2 empty lines and then show in separate paragraphs the keypoints. Each keypoint should be 1-2 sentences. Your output should be a continuous text. Don't use latex in your output, nor titles for keypoints. Only simple text. Use the following URL:\n" + input,
    
            ]);
            return result.response.text();
        } else if (type === "Text") {
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro-preview-06-05" });
            const result = await model.generateContent([
            "You are an assistant helping someone with ADHD break down their daily tasks. Given a list of tasks, split each one into smaller, manageable steps. Simplify complex actions, suggest helpful cues or reminders, and keep instructions clear and friendly. Focus on reducing overwhelm and making the day feel more doable. Break down and schedule the following tasks:\n" + input,
               
            ]);
            console.log(result.response.text());
            return result.response.text();
        }
     } catch (err) {
      console.error("run gemini error:", err);
    }
}
