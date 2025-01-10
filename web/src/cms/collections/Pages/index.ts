import type { CollectionConfig } from "payload";

import { tenantField } from "@/cms/fields/TenantField";
import { getTenantAccessIDs } from "@/utilities/getTenantAccessIDs";
import { baseListFilter } from "./access/baseListFilter";
import { canMutatePage } from "./access/byTenant";
import { readAccess } from "./access/readAccess";

export const Pages: CollectionConfig = {
  slug: "pages",
  access: {
    create: canMutatePage,
    delete: canMutatePage,
    read: readAccess,
    update: canMutatePage,
  },
  admin: {
    baseListFilter,
    useAsTitle: "title",
  },
  hooks: {
    beforeValidate: [
      ({ req, data }) => {
        console.log("beforeChange", { data, req, user: req?.user });
        if (req?.user?.tenants?.length && data) {
          const tenantIds = getTenantAccessIDs(req.user);
          data.tenant = tenantIds[0];
        }
        console.log("AFter", { data });
        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "slug",
      type: "text",
      defaultValue: "home",
      hooks: {
        /* We insert the tenant field based on the user who is operating */
        //beforeValidate: [ensureUniqueSlug],
      },
      index: true,
    },
    tenantField,
    /* {
      name: "tenant",
      type: "relationship",
      hasMany: false,
      index: true,
      relationTo: "tenants",
      required: true,
      hidden: true,
    }, */
  ],
};
