import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
export class SubDepartment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;
}

@ObjectType()
export class Department {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  // Store subDepartments as JSON array
  @Field(() => [SubDepartment], { nullable: true })
  @Column('json', { nullable: true })
  subDepartments?: SubDepartment[];
}
