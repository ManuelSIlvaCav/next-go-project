import { CollectionConfig } from "payload";
import { loginAfterCreate } from "./hooks/loginAfterCreate";
import { protectRoles } from "./hooks/protectRoles";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    tokenExpiration: 7200, // 8 hours
    cookies: {
      sameSite: "None",
      secure: true,
      domain: process.env.COOKIE_DOMAIN,
    },

    /* strategies: [
      {
        name: "created-user",
        authenticate: async ({
          payload,
          headers,
        }): Promise<AuthStrategyResult> => {
          console.log("loging authenticate 2", { headers });

          const usersQuery = await payload.find({
            collection: "users",
            where: {
              email: {
                equals: "manuel@gmail.com",
              },
            },
          });

          const user = usersQuery.docs[0] || null;

          return {
            user: {
              ...user,
              collection: "users",
            },
          };
        },
      },
    ], */
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
      name: "businessId",
      type: "text",
      required: true,
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
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
    },
  ],
};
