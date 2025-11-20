import { Resolver, Query, Mutation, Args, Int } from "@nestjs/graphql";
import { DepartmentsService } from "./departments.service";
import { Department } from "./entities/department.entity";
import { GqlAuthGuard } from "src/common/guards/gql-auth.guard";
import { CreateDepartmentInput } from "./dto/create-department.input";
import { UseGuards } from "@nestjs/common";
import { UpdateDepartmentInput } from "./dto/update-department.input";


@Resolver(() => Department)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Department)
  createDepartment(@Args("input") input: CreateDepartmentInput) {
    return this.departmentsService.create(input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Department])
  getDepartments() {
    return this.departmentsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Department)
  updateDepartment(@Args("input") input: UpdateDepartmentInput) {
    return this.departmentsService.update(input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  deleteDepartment(@Args("id", { type: () => Int }) id: number) {
    return this.departmentsService.remove(id);
  }
}
