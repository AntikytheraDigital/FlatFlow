import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { toast } from "./ui/use-toast";
import UserSettingsLayout from "./user-settings-layout";

const memberSchema = z.object({
  name: z.string(),
  availability: z.array(z.string()),
});

const formSchema = z.object({
  flatname: z.string().min(2).max(50),
  members: z.array(memberSchema),
});

type FlatSettingsFormValues = z.infer<typeof formSchema>;

type FlatSettingsFormProps = {
  flatmates: UserProfile[];
};

type UserProfile = {
  id: string;
  firstName: string | null;
  picture: string;
};

export function FlatSettingsForm({ flatmates }: FlatSettingsFormProps) {
  const form = useForm<FlatSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flatname: "",
      members: flatmates.map((mate) => ({
        name: mate.firstName ?? "",
        availability: [],
      })),
    },
    mode: "onChange",
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "members",
  });

  const onSubmit = (data: FlatSettingsFormValues) => {
    console.log("Submitted values:", data);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  const { register, setValue } = form;
  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleCheck = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    const currentAvailability = form.getValues(`members.${index}.availability`);
    if (e.target.checked) {
      setValue(`members.${index}.availability`, [
        ...currentAvailability,
        value,
      ]);
    } else {
      setValue(
        `members.${index}.availability`,
        currentAvailability.filter((day: string) => day !== value)
      );
    }
  };

  return (
    <UserSettingsLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="flatname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Flat Name</FormLabel>
                <FormControl>
                  <Input placeholder="test" {...field} />
                </FormControl>
                <FormDescription>
                  This is your flats display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((memberField, index) => (
            <div key={memberField.id}>
              <FormLabel>{memberField.name}&apos;s Availability</FormLabel>
              <div className="checkbox-container">
                {daysOfWeek.map((day, i) => (
                  <div key={i}>
                    <input
                      type="checkbox"
                      id={`day-${i}-${index}`}
                      value={day}
                      {...register(`members.${index}.availability`)}
                      onChange={(e) => handleCheck(index, e)}
                    />
                    <label htmlFor={`day-${i}-${index}`}>{day.charAt(0)}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </UserSettingsLayout>
  );
}
