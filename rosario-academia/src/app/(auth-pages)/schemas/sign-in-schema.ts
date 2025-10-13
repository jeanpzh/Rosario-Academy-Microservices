import { TypeOf, object, string } from 'zod'

const strongPwd =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+}{":;'?/>.<,])(?=.*[a-zA-Z]).{8,}$/
const hex32 = /^[a-f0-9]{32}$/

export const signInSchema = object({
  email: string({ required_error: 'Email is required' })
    .min(1, 'Email es requerido')
    .email('Invalid email'),

  password: string({ required_error: 'Password is required' })
    .min(8, 'Password tiene que tener al menos 8 caracteres')
})

export type signInSchemaType = TypeOf<typeof signInSchema>
