import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { API_URL } from "@/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { pageTransition } from "@/components/animations";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormData>();

  const sendEmail = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await fetch(`${API_URL}/contact/email/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: ContactFormData) => {
    sendEmail.mutate(data);
  };

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto p-4 max-w-2xl"
    >
      <Card className="bg-background border-none shadow-lg">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
          <CardDescription>
            Have questions about our dance events? Get in touch with us!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input {...form.register("name")} required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input {...form.register("email")} type="email" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                {...form.register("message")}
                className="min-h-[150px]"
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={sendEmail.isPending}>
              {sendEmail.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-8 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
          <div className="space-y-1 text-gray-600">
            <p>Email: abrahamvidalcastillo2@gmail.com</p>
            <p>Phone: (787) 317-6695</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
          <div className="space-y-1 text-gray-600">
            <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p>Saturday: Closed</p>
            <p>Sunday: Closed</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Contact;