import { UserRole } from "@prisma/client"


export interface CreateUserDTO {
  name: string
  email: string
  password: string
  role?: UserRole
}


export interface LoginDTO {
  email: string
  password: string
}