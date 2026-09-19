import type {
  ReasoningProvider,
  ReasoningRequest,
  ReasoningResponse,
} from "../types";

export interface RemoteReasoningClient {
  complete(
    request: ReasoningRequest,
  ): Promise<ReasoningResponse>;
}

export class RemoteReasoningProvider
  implements ReasoningProvider
{
  constructor(
    private readonly client: RemoteReasoningClient,
  ) {}

  async reason(
    request: ReasoningRequest,
  ): Promise<ReasoningResponse> {
    if (!request.context) {
      throw new Error(
        "Remote reasoning requires sanitized context",
      );
    }

    return this.client.complete(request);
  }
}
