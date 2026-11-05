import { rejects } from "assert";
import { resolve } from "path";

type User = {
  email: string;
  password: string;
  name: string;
  role: string;
  other: string;
};
const users: User[] = [
  {
    email: "admin@company.com",
    password: "pass",
    name: "นายยิ่งใหญ่ โอฬาร",
    role: "admin",
    other: "...",
  },
  {
    email: "user@company.com",
    password: "pass",
    name: "น.ส.ใช้งาน ทั่วไป",
    role: "user",
    other: "...",
  },
  {
    email: "manager@company.com",
    password: "pass",
    name: "นางจัดการ เฉพาะการ",
    role: "manager",
    other: "...",
  },
];

export type Credentail = {
  token: string;
  email: string;
  name: string;
  role: string;
};

export const login = (
  email: string,
  pass: string,
): Promise<Credentail | string> => {
  return new Promise((resolve, rejects) => {
    setTimeout(
      () => {
        if (Math.random() <= 0.8) {
          //find user by email , pass
          const user = users.find(
            (u) => u.email === email && u.password === pass,
          );
          //check user
          if (user === undefined) {
            rejects("user not found ");
            return;
          }

          //user found
          const newCredentail: Credentail = {
            token: crypto.randomUUID(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
          resolve(newCredentail);
        } else {
          rejects("connerction refuse");
        }
      },
      1000 + Math.random() * 2000,
    );
  });
};

export const logout = (token: string): Promise<string> => {
  return new Promise((resolve, rejects) => {
    setTimeout(
      () => {
        if (Math.random() <= 0.8) {
          resolve("success");
        } else {
          rejects("comnection refused");
        }
      },
      1000 + Math.random() * 2000,
    );
  });
};
