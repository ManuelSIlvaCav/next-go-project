import { Slash } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

type BreadCrumbProps = {
  items: { name: string; href: string }[];
  page: { name: string; href: string };
};

export function AppBreadCrumb(props: BreadCrumbProps) {
  return (
    <Breadcrumb className="pb-4">
      <BreadcrumbList>
        {props.items.map((item, index) => (
          <React.Fragment key={item.href}>
            <BreadcrumbItem>
              <BreadcrumbLink key={item.href} href={item.href}>
                {item.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < props.items.length && (
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{props.page.name}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
