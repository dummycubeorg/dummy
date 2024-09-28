import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Link, useLocation } from "wouter";
import ky from "ky";
import { ServerResponse } from "../../lib/types";
import { LoaderIcon } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/^\S*$/, "Should not contain spaces"),
  password: z.string().min(8),
});

type FormType = z.infer<typeof formSchema>;

const RegisterForm: FC = () => {
  const [, navigate] = useLocation();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormType) => {
    try {
      const response = await ky
        .post<ServerResponse>(`${import.meta.env.VITE_API_URL}/v1/register`, {
          json: data,
        })
        .json();

      form.reset();
      navigate("/login");
      setTimeout(() => {
        toast.success(response.message);
      }, 0);
    } catch (err) {
      console.error(err);
      toast.error("Error occurred");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5 rounded-lg border border-slate-200 bg-white px-6 pb-7 pt-10 shadow-sm"
      >
        <div className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && (
              <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign up
          </Button>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">
            Already have an account?
          </span>{" "}
          <Link
            href="/login"
            className="text-sm font-medium text-blue-600 underline"
          >
            Log in
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default RegisterForm;
