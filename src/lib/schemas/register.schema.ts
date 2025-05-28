import * as yup from 'yup';
import { Roles } from '../enums/roles.enum';

export const registerSchema = yup.object().shape({
    username: yup.string(),
     email: yup
        .string()
        .required("Email is required")
        .email("Invalid email format"),
      password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
     roles: yup.mixed<Roles>().oneOf(Object.values(Roles))
})