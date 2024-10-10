"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MobileFiltersProps = {
  className?: string;
  children?: React.ReactNode;
};

export default function MobileFilters(props: MobileFiltersProps) {
  return (
    <div className={props.className}>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </SheetTrigger>
        <SheetContent side={"left"}>
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
            <SheetDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </SheetDescription>
          </SheetHeader>
          {props.children}
        </SheetContent>
      </Sheet>
    </div>
  );
}
