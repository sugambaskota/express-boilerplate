import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import { BeforeInsert, Column, Entity, Index, OneToMany } from "typeorm";

import { BaseModel } from "@/abstracts/base-model";
import { UserRoles } from "@/constants/user-roles";
import { Blog } from "./blog";

@Entity("users")
export class User extends BaseModel {
  @Index("emailIndex")
  @Column()
  email: string;

  @Column({
    select: false,
  })
  password: string;

  @Column()
  fullName: string;

  @Column({
    nullable: true,
  })
  image: string;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({
    nullable: true,
    select: false,
  })
  verificationToken: string;

  @Column({
    nullable: true,
    select: false,
  })
  passwordResetToken: string;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.USER,
  })
  role: UserRoles;

  @OneToMany(() => Blog, (blog) => blog.user)
  blogs: Blog[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(
    candidatePassword: string,
    hashedPassword: string,
  ) {
    return await bcrypt.compare(candidatePassword, hashedPassword);
  }

  static createVerificationCode() {
    const verificationCode = crypto.randomBytes(32).toString("hex");

    const hashedVerificationCode = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");

    return {
      verificationCode,
      hashedVerificationCode,
    };
  }
}
