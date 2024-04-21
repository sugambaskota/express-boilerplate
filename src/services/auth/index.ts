import { z } from "zod";

import { dataSource } from "@/data-source";
import { User } from "@/entities/user";
import { RegisterUserSchema } from "@/validation/schemas/auth";

const userRepository = dataSource.getRepository(User);

export const registerUser = async (
  data: z.infer<typeof RegisterUserSchema>,
) => {
  return await userRepository.save(userRepository.create(data));
};

export const getUserById = async (id: string) => {
  return await userRepository.findOneBy({
    id,
  });
};

export const getUserByEmail = async (email: string) => {
  return await userRepository
    .createQueryBuilder("user")
    .where("user.email = :email", { email })
    .addSelect(["user.password"])
    .getOne();
};

export const getUserProfile = async (id: string) => {
  return await userRepository.findOneBy({
    id,
  });
};
