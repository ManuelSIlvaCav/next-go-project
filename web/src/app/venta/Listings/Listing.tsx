import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

type Listing = {
  title: string;
  description: string;
  image: string;
  price: number;
};

type ListingProps = {
  listing: Listing;
  isDesktop?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Listing(props: ListingProps) {
  const { listing } = props;
  return (
    <Card>
      <CardContent className="pt-4 group cursor-pointer flex flex-col items-center justify-center">
        <div className=" overflow-hidden w-[50vw] sm:w-[30vw]  lg:w-[25vw] xl:w-[14vw] group-hover:opacity-75">
          <div className="w-full">
            <AspectRatio
              ratio={props.isDesktop ? 3 / 4 : 1 / 1}
              className="bg-muted"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={listing.title}
                src={listing.image}
                className="object-fill object-center h-full w-full justify-center"
              />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col space-y-2 p-4">
            <h3 className="text-sm font-medium text-gray-900">
              {/*  <a href={listing.title}>
              <span aria-hidden="true" className="absolute inset-0" />
              {listing.title}
            </a> */}
            </h3>
            <div className="">
              <p className="text-sm text-gray-500 line-clamp-3">
                {listing.description}
              </p>
            </div>
            <div className="flex flex-1 flex-col justify-end">
              {/* <p className="text-sm italic text-gray-500">{product.options}</p> */}
              <p className="text-base font-medium text-gray-900">
                {listing.price}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      {/* <CardHeader>
        <CardTitle>{listing.title}</CardTitle>
        <CardDescription>{listing.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={listing.image} alt={listing.title} />
      </CardContent>
      <CardFooter>
        <span>{listing.price}</span>
      </CardFooter> */}
    </Card>
  );
}
