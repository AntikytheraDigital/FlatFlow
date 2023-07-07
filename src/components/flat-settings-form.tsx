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
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "./ui/use-toast";
import UserSettingsLayout from "./user-settings-layout";

const formSchema = z.object({
  flatname: z.string().min(2).max(50),
  availability: z.array(z.string()),
});

type FlatSettingsFormValues = z.infer<typeof formSchema>;

export function FlatSettingsForm() {
  const form = useForm<FlatSettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      flatname: "",
      availability: [],
    },
    mode: "onChange",
  });

  const onSubmit = (data: FlatSettingsFormValues) => {
    console.log("memexd");
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

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const currentAvailability = form.getValues("availability");
    if (e.target.checked) {
      setValue("availability", [...currentAvailability, value]);
    } else {
      setValue(
        "availability",
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
          <FormField
            control={form.control}
            name="availability"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Availability</FormLabel>
                <FormControl>
                  <div className="checkbox-container">
                    {daysOfWeek.map((day, i) => (
                      <div key={i}>
                        <input
                          type="checkbox"
                          id={`day-${i}`}
                          value={day}
                          {...register("availability")}
                          onChange={handleCheck}
                        />
                        <label htmlFor={`day-${i}`}>{day.charAt(0)}</label>
                      </div>
                    ))}
                  </div>
                </FormControl>
                <FormDescription>
                  Select the days you are available.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </UserSettingsLayout>
  );
}
