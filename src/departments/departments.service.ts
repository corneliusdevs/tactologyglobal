import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Department } from "./entities/department.entity";
import { CreateDepartmentInput } from "./dto/create-department.input";
import { UpdateDepartmentInput } from "./dto/update-department.input";


@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>
  ) {}

  async create(input: CreateDepartmentInput): Promise<Department> {
    const department = this.departmentRepo.create(input);
    return this.departmentRepo.save(department);
  }

  async findAll(): Promise<Department[]> {
    return this.departmentRepo.find();
  }

  async update(input: UpdateDepartmentInput): Promise<Department> {
    const dept = await this.departmentRepo.findOne({ where: { id: input.id } });
    if (!dept) throw new NotFoundException("Department not found");
    dept.name = input.name;
    return this.departmentRepo.save(dept);
  }

  async remove(id: number): Promise<boolean> {
    const dept = await this.departmentRepo.findOne({ where: { id } });
    if (!dept) throw new NotFoundException("Department not found");
    await this.departmentRepo.remove(dept);
    return true;
  }
}
