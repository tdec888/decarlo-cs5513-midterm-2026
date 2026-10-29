import { genkit } from 'kit';

// 1. Updated the import string to pull from your newly installed package!
import { vertexAI } from '@genkit-ai/google-genai';

import { getReviewsByTrailId } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore"; 

// THIS FUNCTION IS REPLACING THE ORIGINAL GEMINI 2.0 WITH VERTEX AND GEMINI 2.5 FLASH
export async function GeminiSummary({ trailId }) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const reviews = await getReviewsByTrailId(
    getFirestore(firebaseServerApp),
    trailId
  );

  const reviewSeparator = "@";
  const prompt = `
    Based on the following hiking trail reviews, 
    where each review is separated by a '${reviewSeparator}' character, 
    create a one-sentence summary of what people think of the trail. 

    Here are the reviews: ${reviews.map((review) => review.text).join(reviewSeparator)}
  `;

  try {
    // 2. Updated the location to 'global' and model passing to the proper syntax
    const ai = genkit({
      plugins: [vertexAI({ location: 'global' })],
    });
    
    // 3. Moved the model parameter explicitly into the generate function
    const { text } = await ai.generate({
      model: 'vertexai/gemini-2.5-flash',
      prompt: prompt,
    });

    return (
      <div className="trail__review_summary">
        <p>{text}</p>
        <p>✨ Summarized with Gemini via Vertex AI</p>
      </div>
    );
  } catch (e) {
    console.error(e);
    return <p>Error summarizing reviews.</p>;
  }
}

// Shown while the summary section is waiting to render.
export function GeminiSummarySkeleton() {
  return (
    <div className="trail__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}