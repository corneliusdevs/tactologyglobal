import { ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";



@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt")  {
  getRequest(context: ExecutionContext) {
    // Grapghql resolvers do not automatically export the req object unlike rest controllers, so we have to extract the req object here
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}