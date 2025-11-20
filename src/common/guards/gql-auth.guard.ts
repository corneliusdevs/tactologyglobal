// import { ExecutionContext, Injectable } from "@nestjs/common";
// import { GqlExecutionContext } from "@nestjs/graphql";
// import { AuthGuard } from "@nestjs/passport";



// @Injectable()
// export class GqlAuthGuard extends AuthGuard("jwt")  {
//   getRequest(context: ExecutionContext) {
//     // Grapghql resolvers do not automatically export the req object unlike rest controllers, so we have to extract the req object here
//     const ctx = GqlExecutionContext.create(context);
//     return ctx.getContext().req;
//   }
// }


import { ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";
import { IS_PUBLIC_KEY } from "../decorators/mark-as-route-public";


// This guard extends the default JWT AuthGuard to work with GraphQL and also checks for @Public() decorator so that public routes can be accessed without authentication 
@Injectable()
export class GqlAuthGuard extends AuthGuard("jwt") {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Check for @Public()
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
