import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessUsersList from "./Users/list";

export default function BusinessPage() {
  return (
    <div className="flex flex-col space-y-4 items-center">
      <Tabs defaultValue="account" className="w-[50vw]">
        <TabsList className="">
          <TabsTrigger value="account">Usuarios</TabsTrigger>
          <TabsTrigger value="password">Roles y Permisos</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <BusinessUsersList />
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  );
}
