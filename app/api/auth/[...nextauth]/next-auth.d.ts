import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      isAdmin?:boolean
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string
    isAdmin?:boolean
  }
}