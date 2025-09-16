'use server';
/**
 * @fileOverview An AI agent that analyzes symptoms and suggests possible conditions.
 *
 * - analyzeSymptomsAndSuggestConditions - A function that handles the symptom analysis process.
 * - AnalyzeSymptomsAndSuggestConditionsInput - The input type for the analyzeSymptomsAndSuggestConditions function.
 * - AnalyzeSymptomsAndSuggestConditionsOutput - The return type for the analyzeSymptomsAndSuggestConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSymptomsAndSuggestConditionsInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the user symptoms.'),
});
export type AnalyzeSymptomsAndSuggestConditionsInput = z.infer<typeof AnalyzeSymptomsAndSuggestConditionsInputSchema>;

const AnalyzeSymptomsAndSuggestConditionsOutputSchema = z.object({
  possibleConditions: z.array(z.string()).describe('A list of possible medical conditions that could be causing the symptoms.'),
  reasoning: z.string().describe('The AI reasoning for suggesting these conditions, including relevant information.'),
  recommendation: z.string().describe('A recommendation of action for the user to take, such as seeking professional medical advice.'),
});
export type AnalyzeSymptomsAndSuggestConditionsOutput = z.infer<typeof AnalyzeSymptomsAndSuggestConditionsOutputSchema>;

export async function analyzeSymptomsAndSuggestConditions(input: AnalyzeSymptomsAndSuggestConditionsInput): Promise<AnalyzeSymptomsAndSuggestConditionsOutput> {
  return analyzeSymptomsAndSuggestConditionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSymptomsAndSuggestConditionsPrompt',
  input: {schema: AnalyzeSymptomsAndSuggestConditionsInputSchema},
  output: {schema: AnalyzeSymptomsAndSuggestConditionsOutputSchema},
  prompt: `You are an AI medical assistant. Analyze the following symptoms and suggest possible medical conditions.

Symptoms: {{{symptoms}}}

Consider all relevant information and provide a detailed reasoning for your suggestions. Also, provide a recommendation of action for the user to take.

Important: User should seek for professional advice for serious health concerns. User should not rely on this app solely for their health-related decision.`,
});

const analyzeSymptomsAndSuggestConditionsFlow = ai.defineFlow(
  {
    name: 'analyzeSymptomsAndSuggestConditionsFlow',
    inputSchema: AnalyzeSymptomsAndSuggestConditionsInputSchema,
    outputSchema: AnalyzeSymptomsAndSuggestConditionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
