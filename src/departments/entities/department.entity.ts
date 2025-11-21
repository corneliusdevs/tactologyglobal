import { Field, ID, ObjectType } from '@nestjs/graphql';
import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsNotEmpty,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
@Entity()
export class Department {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  // Store subDepartments as JSON array
  @Field(() => [SubDepartment], { nullable: true })
  @Column('json', { nullable: true, default: [] })
  subDepartments: SubDepartment[];
}
