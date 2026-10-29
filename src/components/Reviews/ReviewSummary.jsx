import { genkit } from 'genkit';

// Using the legacy package your server environment is currently locked into
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
    // FIX: Set the exact region your Cloud Run service utilizes to build valid endpoints
    const ai = genkit({
      plugins: [vertexAI({ location: 'us-east4' })], 
    });
    
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

export function GeminiSummarySkeleton() {
  return (
    <div className="trail__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}