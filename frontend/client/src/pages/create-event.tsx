import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { cn } from "@/components/utils";
import { pageTransition } from "@/components/animations";
import { useToast } from "@/hooks/use-toast";
import { type EventFormData } from "@/components/types";
import { insertEventSchema } from "@db/schema";
import { API_URL } from "@/config";

const CreateEvent = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    resolver: zodResolver(insertEventSchema),
    defaultValues: {
      title: "",
      description: "",
      date: undefined,
      time: "",
      venue: "",
      imageUrl: "",
      price: "",
      recurring: "",
      source: "",
    },
  });

  const watchedFields = form.watch();
  console.log('Form values:', watchedFields);

  const createEvent = useMutation({
    mutationFn: async (data: EventFormData) => {
      console.log('Raw date from calendar:', data.date);

      // Format date to YYYY-MM-DD, stripping out day name and timezone
      const formattedData = {
        event_date: data.date ? format(data.date, 'yyyy-MM-dd') : null,
        time: data.time || null,
        name: data.title,
        location: data.venue,
        source: data.source || null,
        price: data.price || null,
        details: data.description || null,
        recurrence: null,
        recurrence_interval: null,
        image_url: data.imageUrl || null,
        phone_number: null
      };

      console.log('Formatted date:', formattedData.event_date);
      console.log('Sending to server:', formattedData);

      const response = await fetch(`${API_URL}/events/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData)
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server error:', error);
        throw new Error(error.message || "Failed to create event");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Event Created",
        description: "Your event has been successfully created.",
      });
      setLocation("/events");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (formData: EventFormData) => {
    const values = form.getValues();
    console.log('Form values from getValues:', values);

    // Check individual required fields
    const requiredFieldsCheck = {
      title: !!values.title,
      date: !!values.date,
      time: !!values.time,
      venue: !!values.venue
    };
    console.log('Required fields check:', requiredFieldsCheck);

    // If all required fields are present, submit
    if (Object.values(requiredFieldsCheck).every(Boolean)) {
      createEvent.mutate({
        title: values.title,
        description: values.description,
        date: values.date,
        time: values.time,
        venue: values.venue,
        imageUrl: values.imageUrl,
        price: values.price,
        recurring: values.recurring,
        source: values.source
      });
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto p-4 max-w-2xl"
    >
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Name *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter event name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          ""
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          

          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input {...field} type="time" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="venue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter event location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image URL (optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Add an image URL if available" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (optional)</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurring"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurring (optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="ex. happens every week or month"
                    className="placeholder:text-muted-foreground/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="source"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Link (optional)</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Link to your page if available"
                    className="placeholder:text-muted-foreground/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={createEvent.isPending}
          >
            {createEvent.isPending ? "Creating..." : "Create Event"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
};

export default CreateEvent;