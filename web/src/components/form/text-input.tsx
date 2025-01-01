import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type TextInputProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<any>;
  fieldName: string;
  label: string;
  placeholder: string;
};

export default function TextInput(props: TextInputProps) {
  return (
    <div>
      <FormField
        name={props.fieldName}
        control={props.form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">{props.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={props.placeholder}
                type="text"
                className="mt-3"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-red-500 capitalize" />
          </FormItem>
        )}
      />
    </div>
  );
}
