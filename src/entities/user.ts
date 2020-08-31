import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class PublicUser {
  @Field()
  public name!: string;

  @Field()
  public username!: string;
  
  @Field()
  public createdAt!: Date;
}

@Entity()
@ObjectType()
export class User extends BaseEntity {
  @Field(type => ID)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column()
  public password!: string;

  @Field()
  @Column()
  public username!: string;

  @Field()
  @Column()
  public name!: string;

  @Field()
  @Column()
  public email!: string;

  @Field(type => Date)
  @Column()
  public createdAt!: Date;
}
