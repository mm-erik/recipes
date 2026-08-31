import { createClerkClient } from "@clerk/backend";

export type SessionVerifier = (request: Request) => Promise<string | null>;

export function createClerkSessionVerifier(secretKey: string, publishableKey?: string): SessionVerifier {
  const clerk = createClerkClient({ secretKey, publishableKey });

  return async function verifySession(request) {
    const requestState = await clerk.authenticateRequest(request);
    return requestState.toAuth().userId;
  };
}
