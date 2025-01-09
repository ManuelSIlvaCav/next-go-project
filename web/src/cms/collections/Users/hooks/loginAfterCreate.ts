import { AfterChangeHook } from "node_modules/payload/dist/collections/config/types";

export const loginAfterCreate: AfterChangeHook = async ({
  doc,
  operation,
  req,
  req: { body = {}, payload, res },
}) => {
  if (operation === "create") {
    const { email, password } = body;

    console.log("loginAfterCreate", { email, password, req });

    if (email && password) {
      const { token, user } = await payload.login({
        collection: "users",
        data: { email, password },
        req,
        res,
      });

      return {
        ...doc,
        token,
        user,
      };
    }
  }

  return doc;
};
