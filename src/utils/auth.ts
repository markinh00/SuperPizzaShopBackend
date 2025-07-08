import { User, UserRole } from "../schemas/users.schema";
import { getAdminByEmail, getAdminById } from "../services/admins.service";
import { getCustomerByEmail, getCustomerById } from "../services/customers.service";
import { verifyPassword } from "./hash";
import { Customer, Admin } from "@prisma/client";


export async function authenticateUser(email: string, password: string): Promise<User | undefined> {
    let user: Customer | Admin | null = null;
    let role: UserRole | undefined = undefined;

    user = await getCustomerByEmail(email)
    role = UserRole.CUSTOMER

    if (!user) {
        user = await getAdminByEmail(email);
        role = UserRole.ADMIN
    }

    if (!user) return;

    const passwordMacthes = await verifyPassword(password, user.password);
    if (!passwordMacthes) return;

    return {
        data: user,
        role
    }
}

export async function getCurrentUser(id: string): Promise<User | undefined> {
    let data: Customer | Admin | null = null;
    let role: UserRole | undefined = undefined;

    data = await getCustomerById(id);
    role = UserRole.CUSTOMER

    if (!data) {
        data = await getAdminById(id);
        role = UserRole.ADMIN
    }

    if (!data) return

    return { data, role }
}