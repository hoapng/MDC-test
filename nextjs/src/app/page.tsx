"use client";

import * as React from "react";

import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
  AlertDialogHeader,
} from "@/components/ui/alert-dialog";
import CountDown from "@/components/CountDown";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  username: z
    .string()
    .min(6, {
      message: "Username must be 6 characters.",
    })
    .max(6, {
      message: "Username must be 6 characters.",
    }),
});

export default function ProgressDemo() {
  const [password, setPassword] = React.useState("");
  const [timing, setTiming] = React.useState(false);
  const [count, setCount] = React.useState(0);

  const [progress, setProgress] = React.useState(0);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setProgress(0);
    setCount(0);
    setTiming(true);
    await findPassword2(values.username);
  }

  const callAPI = async (u: string, p: string) => {
    // console.log({
    //   username: u,
    //   password: p,
    // });
    const res = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: u,
        password: p,
      }),
    });
    return res.json();
  };
  const findPassword = async (u: string) => {
    for (let i = 0; i <= 1000000; i++) {
      let result = i.toString();
      while (result.length < 6) {
        result = 0 + result;
      }
      setProgress((+result * 100) / 1000000);
      const res = (await callAPI(u, result)) as any;
      console.log(res);
      if (res && res.userId) {
        setProgress(100);
        setPassword(result);
        setTiming(false);
        break;
      }
    }
  };

  const findPassword2 = async (u: string) => {
    let arr = [];
    for (let i = 0; i <= 1000000; i++) {
      let result = i.toString();
      while (result.length < 6) {
        result = 0 + result;
      }
      arr.push(result);
    }
    for (let i = 0; i <= 1000000; i += 1000) {
      const batch = arr.slice(i, i + 1000);
      const result = await Promise.all(
        batch.map(async (p) => {
          try {
            const res = (await callAPI(u, p)) as any;
            if (res && res.userId) {
              return p;
            }
            return "0";
          } catch (e) {
            setProgress(100);
            setTiming(false);
            setPassword("Something error");
          }
        })
      );
      setProgress((i * 100) / 1000000);
      console.log(result);
      // break;
      if (result.some((res) => res !== "0")) {
        for (let j = 0; j < 1000; j++) {
          if (result[j] !== "0") {
            setPassword(result[j] as string);
            setProgress(100);
            setTiming(false);
            break;
          }
        }
        break;
      }
    }
  };

  return (
    <div className="content-center h-screen grid gap-4">
      {/* <div className="flex w-full max-w-sm items-center space-x-2 m-auto">
        <Input
          type="username"
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Button
          type="submit"
          onClick={() => {
            findPassword2();
            setProgress(0);
            setCount(0);
            setTiming(true);
          }}
        >
          Subscribe
        </Button>
      </div> */}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full max-w-sm items-center space-x-2 m-auto"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                {/* <FormDescription>
                  This is your public display name.
                </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <Button type="submit">Submit</Button> */}
        </form>
      </Form>

      <CountDown timing={timing} count={count} setCount={setCount} />

      <Progress value={progress} className="w-[60%] m-auto" />
      <div className="m-auto">{progress.toFixed(1)}%</div>

      {progress === 100 && (
        <div className="m-auto">
          {password !== "1000000" ? password : "Not found"}
        </div>
      )}
    </div>
  );
}
