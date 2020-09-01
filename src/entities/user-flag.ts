import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";
import { User } from "./user";

@Entity()
@ObjectType()
export class UserFlag extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column({ default: false })
  public isAdmin!: boolean;

  @Field()
  @Column({ default: false })
  public isModerator!: boolean;

  @OneToOne(type => User, user => user.flags, { nullable: true })
  @JoinColumn()
  public user?: User;
}