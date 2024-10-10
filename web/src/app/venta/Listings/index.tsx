"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useMediaQuery from "@/hooks/useMediaQuery";
import Listing from "./Listing";

const listings = [
  {
    title: "Listing3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    price: 1000000,
    image: "https://via.placeholder.com/150",
  },
  {
    title: "Listing3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    price: 1000000,
    image:
      "https://tailwindui.com/plus/img/ecommerce-images/category-page-02-image-card-01.jpg",
  },
  {
    title: "Listing3",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    price: 1000000,
    image:
      "https://tailwindui.com/plus/img/ecommerce-images/category-page-02-image-card-02.jpg",
  },
  {
    title: "Listing4",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    price: 1000000,
    image:
      "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80",
  },
];

export default function Listings() {
  const isDesktop = useMediaQuery("(min-width: 640px)");
  console.log("isDesktop", isDesktop);
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl">
      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3 lg:gap-x-8">
        {[...listings, ...listings].map((listing, index) => (
          <Listing key={index} listing={listing} isDesktop={isDesktop} />
        ))}
      </div>
      <div className="flex flex-row justify-end items-end">
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
}
