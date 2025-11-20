import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

// Set a route as a public route so that it can be accessed without authentication
export const PublicRoute = () => SetMetadata(IS_PUBLIC_KEY, true);
