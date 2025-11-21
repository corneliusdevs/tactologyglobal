import { Resolver, Query, Mutation, Args, Int, ID } from "@nestjs/graphql";
import { DepartmentsService } from "./departments.service";
import { Department } from "./entities/department.entity";
import { GqlAuthGuard } from "src/common/guards/gql-auth.guard";
import { CreateDepartmentInput } from "./dto/create-department.input";
import { UseGuards } from "@nestjs/common";
import { UpdateDepartmentInput } from "./dto/update-department.input";


@Resolver(() => Department)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @UseGuards(GqlAuthGuard) // This mutation is protected although this is not necessary since we applied the guard globally and a public route is marked explicitly with the @PubllicRoute() decorator
  @Mutation(() => Department)
  createDepartment(@Args("input") input: CreateDepartmentInput) {
    return this.departmentsService.create(input);
  }

  @UseGuards(GqlAuthGuard) // This query is protected although this is not necessary since we applied the guard globally and a public route is marked explicitly with the @PubllicRoute() decorator
  @Query(() => [Department])
  getDepartments() {
    return this.departmentsService.findAll();
  }

  @UseGuards(GqlAuthGuard) // This mutation is protected although this is not necessary since we applied the guard globally and a public route is marked explicitly with the @PubllicRoute() decorator
  @Mutation(() => Department)
  updateDepartment(@Args("id", { type: () => ID }) id: string, @Args("input") input: UpdateDepartmentInput) {
    return this.departmentsService.update(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteDepartment(@Args("id", { type: () => Int }) id: number) {
    return this.departmentsService.remove(id);
  }
}
