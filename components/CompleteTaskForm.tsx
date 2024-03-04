"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CompleteTaskFormSchema } from "@/lib/form-schema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { BoxSelect, Loader2 } from "lucide-react"
import { completeTaskSafely } from "@/lib/server-actions"
import { useAction } from "next-safe-action/hooks";


export function CompleteTaskForm( {taskId}: {taskId: number} ) {
  
    const form = useForm<z.infer<typeof CompleteTaskFormSchema>>({
        resolver: zodResolver(CompleteTaskFormSchema),
        defaultValues: {
            taskId: taskId,
        },
    })
    
    const { execute, status } = useAction(completeTaskSafely, {
        onSuccess(data) {
            if (data?.error) {console.log(data.error);}
            if (data?.success) {console.log(data.success);}
        },
        onExecute(data) {
            console.log("completing task...");
        }
    });

    function onSubmit(values: z.infer<typeof CompleteTaskFormSchema>) {
        execute(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
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
                <Button className="p-0" disabled={status === "executing"} type="submit">{status === "executing" ? <Loader2 className="h-6 animate-spin"/> : <BoxSelect className="h-6"/>}</Button>
            </form>
        </Form>
    )
}
