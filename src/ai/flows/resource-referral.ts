'use server';

/**
 * @fileOverview A resource referral AI agent.
 *
 * - getResourceReferral - A function that handles the resource referral process.
 * - ResourceReferralInput - The input type for the getResourceReferral function.
 * - ResourceReferralOutput - The return type for the getResourceReferral function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResourceReferralInputSchema = z.object({
  location: z.string().describe('The current location of the user.'),
  needs: z.string().describe('The specific needs of the user.'),
});
export type ResourceReferralInput = z.infer<typeof ResourceReferralInputSchema>;

const RecommendationSchema = z.object({
  name: z.string().describe("The name of the resource or organization."),
  address: z.string().describe("The full physical address of the resource.")
});

const ResourceReferralOutputSchema = z.object({
  resourceRecommendations: z
    .array(RecommendationSchema)
    .describe('A list of recommended resources for the user, including their name and address.'),
});
export type ResourceReferralOutput = z.infer<typeof ResourceReferralOutputSchema>;

export async function getResourceReferral(
  input: ResourceReferralInput
): Promise<ResourceReferralOutput> {
  return resourceReferralFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resourceReferralPrompt',
  input: {schema: ResourceReferralInputSchema},
  output: {schema: ResourceReferralOutputSchema},
  prompt: `You are an expert at recommending resources to people in need based on their location.

You will use the location and needs of the user to find and recommend resources that can help them.

Location: {{{location}}}
Needs: {{{needs}}}

For each recommendation, provide the name of the resource and its full, physical address. Recommend resources that are relevant to the user's needs and are located near the user.

Ensure that the resource recommendations are in a structured array format.
`,
});

const resourceReferralFlow = ai.defineFlow(
  {
    name: 'resourceReferralFlow',
    inputSchema: ResourceReferralInputSchema,
    outputSchema: ResourceReferralOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
