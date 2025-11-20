import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DepartmentsService } from "./departments.service";
import { DepartmentsResolver } from "./departments.resolver";
import { Department } from "./entities/department.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Department])],
  providers: [DepartmentsService, DepartmentsResolver],
})
export class DepartmentsModule {}
