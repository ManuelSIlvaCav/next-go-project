import { Card, CardContent, CardTitle } from "@/components/ui/card";
import MagicLink from "./magicLink";

export type RedirectPageProps = {
  searchParams: {
    em: string;
    tk: string;
    ui: string;
  };
};

export default async function RedirectPage(props: RedirectPageProps) {
  /* We grab the query params email and token */
  const { em, tk } = props.searchParams;

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <Card className="w-full max-w-md p-4 h-[25vh]">
        <CardTitle className="text-center">
          <p>
            Redirecting... {em} and token {tk} an access_token{" "}
          </p>
        </CardTitle>

        <CardContent className="pt-6">
          <MagicLink searchParams={props.searchParams} />
        </CardContent>
      </Card>
    </div>
  );
}
