export enum ApiEndpoint {
  WordleBestGuess = '/wordle/best-guess',
}

type ApiEndpointConstructor = () => string;

export interface WordleBestGuessResponse {
  guess: string;
}

export const ApiEndpointMap: Record<ApiEndpoint, ApiEndpointConstructor> = {
  [ApiEndpoint.WordleBestGuess]: () => ApiEndpoint.WordleBestGuess,
};
