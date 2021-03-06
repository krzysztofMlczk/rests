import { object, string, TypeOf } from "zod";

export const createUserSchema = object({
    body: object({
        name: string({
            required_error: 'Name is required',
        }),
        password: string({
            required_error: 'Name is required',
        }).min(6, "Password too short - should be at least 6 chars minimum"),
        passwordConfirmation: string({
            required_error: 'Password confirmation is required',
        }),
        email: string({ 
            required_error: 'Email is required' 
        }).email('Invalid email address'),
    }).refine((data) => data.password === data.passwordConfirmation, {
        message: 'Password and confirmation must be the same',
        path: ["passwordConfirmation"],
    }),
});


export type CreateUserInput = Omit<
    TypeOf<typeof createUserSchema>,
    "body.passwordConfirmation"
>; // interface for an input