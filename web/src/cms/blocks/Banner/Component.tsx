import RichText from "@/cms/components/RichText";
import { cn } from "@/lib/utils";
import {
  SerializedEditorState,
  SerializedLexicalNode,
} from "@payloadcms/richtext-lexical/lexical";

type Props = {
  className?: string;
  content: SerializedEditorState<SerializedLexicalNode>;
  style: "info" | "error" | "success" | "warning";
};

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn("mx-auto my-8 w-full", className)}>
      <div
        className={cn("border py-3 px-6 flex items-center rounded", {
          "border-border bg-card": style === "info",
          "border-error bg-error/30": style === "error",
          "border-success bg-success/30": style === "success",
          "border-warning bg-warning/30": style === "warning",
        })}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  );
};
