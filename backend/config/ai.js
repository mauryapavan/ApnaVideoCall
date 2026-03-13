import dotenv from "dotenv";

dotenv.config();
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({ apiKey: process.env.gemini_api_key });

async function getAIResponse(text) {
    try {
      
         const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents:text,
              });
    //    console.log(response.text);

        return response.text;

    } catch (error) {
        console.log("Gemini Error:", error);
        return "AI Error";
    }
}

export default getAIResponse