import { CollectionConfig } from "payload";
import { loginAfterCreate } from "./hooks/loginAfterCreate";
import { protectRoles } from "./hooks/protectRoles";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 129600, // 36 hours
    cookies: {
      sameSite: "None",
      secure: true,
      domain: process.env.COOKIE_DOMAIN,
    },
  },
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
    admin: ({ req: {} }) => true,
  },
  hooks: {
    afterChange: [loginAfterCreate],
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
    {
      name: "email",
      type: "email",
      unique: false,
    },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      saveToJWT: true,
      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        {
          label: "User",
          value: "user",
        },
        {
          label: "Super Admin",
          value: "super-admin",
        },
      ],
    },
    {
      name: "tenants",
      type: "array",
      fields: [
        {
          name: "tenant",
          type: "relationship",
          index: true,
          relationTo: "tenants",
          required: true,
          saveToJWT: true,
        },
        {
          name: "roles",
          type: "select",
          defaultValue: ["tenant-viewer"],
          hasMany: true,
          options: ["tenant-admin", "tenant-viewer"],
          required: true,
        },
      ],
      saveToJWT: true,
    },
  ],
};
