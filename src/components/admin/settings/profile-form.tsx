"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  profession: z.string().min(2, {
    message: "Profession must be at least 2 characters.",
  }),
  experience: z.string().min(1, {
    message: "Years of experience is required.",
  }),
  field: z.string().min(2, {
    message: "Field/Industry must be at least 2 characters.",
  }),
  welcomeMessage: z.string().max(300, {
    message: "Welcome message must not be longer than 300 characters.",
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can be replaced with real data from the backend
const defaultValues: Partial<ProfileFormValues> = {
  name: "Thant Sin",
  profession: "Fullstack Developer",
  experience: "5 years",
  field: "Software Engineering",
  welcomeMessage:
    "Hi, I'm {name}. I'm a {profession} with {experience} in {field}. How can I help you today?",
};

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(data: ProfileFormValues) {
    console.log(data);
    // TODO: Submit data to backend
    // toast({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed in the portfolio and
                used by the bot.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profession"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profession / Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Fullstack Developer" {...field} />
              </FormControl>
              <FormDescription>Your professional title.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="experience"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Years of Experience</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 5 years" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="field"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Field / Industry</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Software Engineering" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="welcomeMessage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Welcome Message Template</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Hi, I'm {name}..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can use placeholders like {"{name}"}, {"{profession}"},
                {"{experience}"}, and {"{field}"}.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update Profile</Button>
      </form>
    </Form>
  );
}
