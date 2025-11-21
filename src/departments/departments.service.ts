import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { Department, SubDepartment } from "./entities/department.entity";
import { CreateDepartmentInput } from "./dto/create-department.input";
import { UpdateDepartmentInput } from "./dto/update-department.input";

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepo: Repository<Department>,
    private dataSource: DataSource
  ) {}

  async create(input: CreateDepartmentInput): Promise<Department> {
        return await this.dataSource.transaction(async (manager) => {
      // Create and save the department first to get its ID
      const department = manager.create(Department, {
        name: input.name,
        subDepartments: [],
      });
      
      const savedDepartment = await manager.save(Department, department);

      // If subdepartments provided, generate IDs continuing from department's ID
      if (input.subDepartments && input.subDepartments.length > 0) {
        let nextId = savedDepartment.id + 1;
        
        savedDepartment.subDepartments = input.subDepartments.map(sub => {
          const subDept: SubDepartment = {
            id: nextId++,
            name: sub.name,
          };
          return subDept;
        });

        // Save department with subdepartments
        await manager.save(Department, savedDepartment);

        // Update the sequence to skip the IDs we used for subdepartments
        // This ensures the next department/subdepartment gets the correct ID
        const sequenceName = 'department_id_seq'; // Default PostgreSQL sequence name
        await manager.query(
          `SELECT setval('${sequenceName}', $1, true)`,
          [nextId - 1]
        );
      }

      return savedDepartment;
    });
  }

async findAll(): Promise<Department[]> {
  const departments = await this.departmentRepo.find({
    order: {
      id: "ASC", // Sorts by the 'id' column in Ascending order (smallest to largest)
    },
  });
  return departments;
}

  async update(id: string, input: UpdateDepartmentInput): Promise<Department> {
    const dept = await this.departmentRepo.findOne({ where: { id: Number(id) } });
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
