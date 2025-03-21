
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { BookOpen, BookPlus, Library, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const { ref: heroRef, inView: heroInView } = useInView({ triggerOnce: true });
  const { ref: featuresRef, inView: featuresInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center px-6 pt-20"
      >
        <div className={cn(
          "max-w-4xl mx-auto text-center space-y-6 transition-all duration-1000 delay-300",
          heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}>
          <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-6 animate-fade-in">
            <span className="text-muted-foreground">Introducing Biblios</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight md:leading-tight">
            Your personal <span className="text-primary">book collection</span>,<br /> beautifully organized
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mt-6">
            Manage your reading list with elegance and simplicity. Track, organize and discover new books.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="font-medium px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="font-medium px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        
        <div className={cn(
          "w-full max-w-5xl mt-16 md:mt-20 transition-all duration-1000 delay-700",
          heroInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        )}>
          <div className="relative mx-auto bg-white rounded-xl shadow-elevation overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/5 pointer-events-none" />
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2000" 
              alt="Books library" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section
        ref={featuresRef}
        className="py-20 md:py-32 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className={cn(
            "text-center max-w-3xl mx-auto space-y-4 mb-16 md:mb-24 transition-all duration-700",
            featuresInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          )}>
            <h2 className="text-3xl md:text-4xl font-bold">Thoughtfully designed for book lovers</h2>
            <p className="text-lg text-muted-foreground">
              Every feature has been carefully considered to enhance your reading experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <FeatureCard 
              icon={<BookOpen className="h-6 w-6" />}
              title="Track Your Reading"
              description="Maintain a comprehensive list of books you've read, are currently reading, or plan to read in the future."
              delay={100}
              inView={featuresInView}
            />
            
            <FeatureCard 
              icon={<BookPlus className="h-6 w-6" />}
              title="Easy Management"
              description="Add, update, and organize your book collection with a beautifully designed and intuitive interface."
              delay={300}
              inView={featuresInView}
            />
            
            <FeatureCard 
              icon={<Shield className="h-6 w-6" />}
              title="Secure Access"
              description="Your collection is protected with modern authentication. Access your books from anywhere, anytime."
              delay={500}
              inView={featuresInView}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section 
        ref={ctaRef}
        className="py-20 px-6 bg-gradient-to-b from-background to-secondary"
      >
        <div className={cn(
          "max-w-4xl mx-auto text-center space-y-8 transition-all duration-1000",
          ctaInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}>
          <h2 className="text-3xl md:text-4xl font-bold">Start building your collection today</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of readers who use Biblios to organize their personal libraries and discover new books.
          </p>
          
          <div className="pt-6">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="font-medium px-10">
                Get Started — It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Library className="h-5 w-5 text-primary" />
            <span className="font-medium">Biblios</span>
          </div>
          
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Biblios. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
  inView: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay, inView }) => {
  return (
    <div 
      className={cn(
        "flex flex-col p-6 rounded-xl neo-morphism transition-all duration-700",
        inView 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-10",
        inView && `delay-${delay}`
      )}
    >
      <div className="p-3 bg-primary/10 rounded-lg w-fit mb-4">
        <div className="text-primary">{icon}</div>
      </div>
      
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
