"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CompleteTaskFormSchema } from "@/lib/form-schema";
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

import { BoxSelect, CheckSquare, Loader2 } from "lucide-react";
import { completeTaskSafely } from "@/lib/server-actions";
import { useAction } from "next-safe-action/hooks";
import { ToastAction } from "./ui/toast";
import { useToast } from "./ui/use-toast";
import { stringJoin } from "@/lib/utils";


export function CompleteTaskForm( {taskId, moreInfoVariant}: {taskId: number, moreInfoVariant: boolean} ) {
  
    const form = useForm<z.infer<typeof CompleteTaskFormSchema>>({
        resolver: zodResolver(CompleteTaskFormSchema),
        defaultValues: {
            taskId: taskId,
        },
    })
    

    const { toast } = useToast();
    const { execute, status } = useAction(completeTaskSafely, {
        onSuccess(data) {
            if (data?.error) {console.log(data.error);}
            if (data?.success) {
                toast({
                    title: "Completed Task",
                    description: stringJoin([data.success.task, " - ", data.success.subjectName]),
                })
            }
        },
        onExecute(data) {
            console.log("completing task...");
        },
        onSettled(data) {
        }
    });

    function onSubmit(values: z.infer<typeof CompleteTaskFormSchema>) {
        execute(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={moreInfoVariant ? "w-full" : ""}>
                <FormField
                control={form.control}
                name="taskId"
                render={({ field }) => (
                    <FormItem>
                    <FormControl>
                        <Input type="hidden" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                {moreInfoVariant ?
                    <Button type="submit" disabled={status === "executing"} className="py-0 px-2 h-5 flex justify-between bg-transparent font-normal text-zinc-900 w-full hover:bg-zinc-600 hover:text-white transition">{ status === "executing" ? <div className="flex justify-between items-center w-full"><span>Completing...</span><Loader2 className="h-4 animate-spin"/></div> : <div className="flex justify-between items-center w-full"><span>Mark as Complete</span><CheckSquare className='h-4'/></div> }</Button>
                :
                    <Button className="p-0" disabled={status === "executing"} type="submit">{status === "executing" ? <Loader2 className="h-6 animate-spin"/> : <BoxSelect className="h-6"/>}</Button>
                }
            </form>
        </Form>
    )
}
