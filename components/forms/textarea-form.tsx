import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

export const TextareaField = ({
    control,
    isLoading,
    placeholder,
    name,
} : {control: any, isLoading: boolean, placeholder: string, name: string}) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="w-full h-full">
                    <FormLabel>
                        {placeholder}
                    </FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder={placeholder}
                            className="resize-y placeholder:text-slate-300 m-0"
                            {...field}
                            disabled={isLoading}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}