import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { pageTransition } from "@/lib/animations";

const Home = () => {
  const [, setLocation] = useLocation();

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen bg-black"
    >
      <div 
        className="min-h-screen bg-cover bg-center relative"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%), url('https://images.unsplash.com/photo-1504609813442-a8924e83f76e')`
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-center items-center p-8 text-center">
          <h1 className="text-[2.75rem] font-medium leading-tight mb-3 text-white/90">
            San Juan Salsa Dance Events
          </h1>
          <p className="text-xl font-light mb-8 text-white/80">
            Discover the rhythm of the Caribbean
          </p>
          <Button
            size="lg"
            onClick={() => setLocation("/events")}
            className="bg-white text-black hover:bg-white/90 text-base px-8 rounded-full"
          >
            Find Events
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;