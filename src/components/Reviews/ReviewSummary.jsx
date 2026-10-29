import { genkit } from 'genkit';
import { vertexAI } from '@genkit-ai/vertexai';

import { getReviewsByTrailId } from "@/src/lib/firebase/firestore.js";
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp";
import { getFirestore } from "firebase/firestore"; 

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
    // Keep us-east4 to avoid endpoint hostname resolution errors
    const ai = genkit({
      plugins: [vertexAI({ location: 'us-east4' })], 
    });
    
    // FIX: Change 'vertexai/gemini-2.5-flash' to 'vertexai/gemini-1.5-flash'
    const { text } = await ai.generate({
      model: 'vertexai/gemini-1.5-flash', // 👈 Swapped to 1.5 for regional availability
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

export function GeminiSummarySkeleton() {
  return (
    <div className="trail__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}