import { motion } from "framer-motion";
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

const Contact = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
    
    const mailtoLink = `mailto:abrahamvidalcastillo2@gmail.com?subject=Dance Events Contact Form&body=Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${message}`;
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening Email Client",
      description: "Redirecting to your email client to send the message.",
    });
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input name="name" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                name="message"
                className="min-h-[150px]"
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Send Message
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