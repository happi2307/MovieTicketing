import React from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    try {
      toast({
        title: "Logging in...",
        description: "Connecting to server",
      });

      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(result.user));
        toast({
          title: "Login Successful",
          description: "Welcome to FlickFind!",
        });
        navigate("/");
      } else {
        toast({
          title: "Login Failed",
          description: result.message || "Please check your credentials and try again",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Server error. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-card p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center items-center">
            <span className="text-primary font-bold text-3xl mr-1">Flick</span>
            <span className="text-foreground font-bold text-3xl">Find</span>
          </div>
          <h2 className="mt-6 text-2xl font-extrabold text-foreground">Sign in to your account</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Access exclusive movie tickets and offers
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email@example.com" {...field} />
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
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button 
              onClick={() => navigate("/signup")}
              className="font-medium text-primary hover:text-primary/80"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
