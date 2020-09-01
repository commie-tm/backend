import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';
import { UserFlag } from './user-flag';

@ObjectType()
export class PublicUser {
  @Field()
  public name!: string;

  @Field()
  public username!: string;
  
  @Field()
  public createdAt!: Date;

  @Field()
  public email!: string;

  @Field(type => UserFlag)
  public flags!: UserFlag;

  @Field()
  public id!: number;
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

  @OneToOne(type => UserFlag, flags => flags.user, { cascade: true, onDelete: "CASCADE" })
  @JoinColumn()
  public flags!: UserFlag;
}

export function convertToPublicUser(user: User): PublicUser {
  return {
    name: user.name,
    username: user.username,
    createdAt: user.createdAt,
    email: user.email,
    flags: user.flags,
    id: user.id
  };
}
