import React, { Fragment } from "react";

import { ImageMedia } from "./ImageMedia";

import type { StaticImageData } from "next/image";
import type { ElementType, Ref } from "react";

import type { Media as MediaType } from "@/payload-types";

export interface Props {
  alt?: string;
  className?: string;
  fill?: boolean; // for NextImage only
  htmlElement?: ElementType | null;
  imgClassName?: string;
  onClick?: () => void;
  onLoad?: () => void;
  loading?: "lazy" | "eager"; // for NextImage only
  priority?: boolean; // for NextImage only
  ref?: Ref<HTMLImageElement | HTMLVideoElement | null>;
  resource?: MediaType | string | number; // for Payload media
  size?: string; // for NextImage only
  src?: StaticImageData; // for static media
  videoClassName?: string;
}

export const Media: React.FC<Props> = (props) => {
  const { className, htmlElement = "div", resource } = props;

  const isVideo =
    typeof resource === "object" && resource?.mimeType?.includes("video");
  const Tag = (htmlElement as any) || Fragment;

  return (
    <Tag
      {...(htmlElement !== null
        ? {
            className,
          }
        : {})}
    >
      {isVideo ? (
        {
          /* <VideoMedia {...props} /> */
        }
      ) : (
        <ImageMedia {...props} />
      )}
    </Tag>
  );
};
