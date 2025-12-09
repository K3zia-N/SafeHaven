'use server';

/**
 * @fileOverview Implements a Genkit flow to find safe locations near the user.
 *
 * - findSafeLocations - A function that orchestrates the process of finding safe locations.
 * - FindSafeLocationsInput - The input type for the findSafeLocations function.
 * - FindSafeLocationsOutput - The return type for the findSafeLocations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FindSafeLocationsInputSchema = z.object({
  userLocation: z
    .string()
    .describe(
      'The current location of the user, as a string (e.g., \'1600 Amphitheatre Parkway, Mountain View, CA\').'
    ),
});
export type FindSafeLocationsInput = z.infer<typeof FindSafeLocationsInputSchema>;

const LocationSchema = z.object({
    name: z.string().describe("The name of the safe location (e.g., 'Anytown Police Department')."),
    address: z.string().describe("The full street address of the location."),
    description: z.string().describe("A brief description of the location (e.g., 'Local police station').")
});

const FindSafeLocationsOutputSchema = z.object({
  safeLocations: z
    .array(LocationSchema)
    .describe(
      'An array of nearby safe locations, including names, addresses, and descriptions.'
    ),
});
export type FindSafeLocationsOutput = z.infer<typeof FindSafeLocationsOutputSchema>;

export async function findSafeLocations(input: FindSafeLocationsInput): Promise<FindSafeLocationsOutput> {
  return findSafeLocationsFlow(input);
}

const findSafeLocationsPrompt = ai.definePrompt({
  name: 'findSafeLocationsPrompt',
  input: {schema: FindSafeLocationsInputSchema},
  output: {schema: FindSafeLocationsOutputSchema},
  prompt: `You are an AI assistant designed to help users find safe locations near them. The user will provide their current location, and you should find a list of nearby safe locations such as police stations, fire stations, and hospitals. Return the results as a structured array of objects, each containing a name, address, and description.

User Location: {{{userLocation}}}`,
});

const findSafeLocationsFlow = ai.defineFlow(
  {
    name: 'findSafeLocationsFlow',
    inputSchema: FindSafeLocationsInputSchema,
    outputSchema: FindSafeLocationsOutputSchema,
  },
  async input => {
    const {output} = await findSafeLocationsPrompt(input);
    return output!;
  }
);
