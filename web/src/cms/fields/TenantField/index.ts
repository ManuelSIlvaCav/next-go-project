import { isSuperAdmin } from "@/cms/access/isSuperAdmin";
import type { Field } from "payload";
import { tenantFieldUpdate } from "./access/update";
import { autofillTenant } from "./hooks/autofillTenant";

export const tenantField: Field = {
  name: "tenant",
  type: "relationship",
  access: {
    read: () => true,
    update: (args) => {
      if (isSuperAdmin(args)) {
        return true;
      }
      return tenantFieldUpdate(args);
    },
  },
  admin: {
    components: {
      Field: "@/cms/fields/TenantField/components/Field#TenantFieldComponent",
    },
    position: "sidebar",
    condition: (data, siblingData, { user }) => {
      if (user?.roles?.includes("super-admin")) {
        return true;
      }
      return false;
    },
  },
  hasMany: false,
  hooks: {
    beforeValidate: [autofillTenant],
  },
  index: true,
  relationTo: "tenants",
  required: true,
};
