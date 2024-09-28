import { zodResolver } from "@hookform/resolvers/zod";
import { FC } from "react";
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
import { ServerResponse } from "@/lib/types";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type FormType = z.infer<typeof formSchema>;

const LoginForm: FC = () => {
  const [, navigate] = useLocation();
  const { mutate } = useSWRConfig();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormType) => {
    try {
      const response = await ky
        .post<ServerResponse>(`${import.meta.env.VITE_API_URL}/v1/login`, {
          json: data,
          credentials: "include",
        })
        .json();

      form.reset();
      mutate("/api/v1/me");
      navigate("/todos", { replace: true });
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
          <Button type="submit" className="w-full">
            Log in
          </Button>
        </div>
        <div>
          <span className="text-sm font-medium text-gray-500">
            Don't have an account?
          </span>{" "}
          <Link
            href="/register"
            className="text-sm font-medium text-blue-600 underline"
          >
            Register
          </Link>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
