import { ThrottlerGuard } from "@nestjs/throttler";
import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class GqlThrottlerGuard extends ThrottlerGuard {
  protected getRequestResponse(context: ExecutionContext) {
    // Extract the request object from the GraphQL context
    const ctx = GqlExecutionContext.create(context);
    const gqlReq = ctx.getContext().req;

    // GraphQL has no "response", return empty object
    return {
      req: gqlReq,
      res: gqlReq?.res || {},
    };
  }
}
