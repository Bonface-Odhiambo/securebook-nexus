
import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';
import Navbar from '@/components/Navbar';
import { Library } from 'lucide-react';

const Auth = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-subtle border border-border p-8 animate-scale-in">
          <div className="flex items-center justify-center mb-8">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Library className="h-6 w-6 text-primary" />
            </div>
          </div>
          
          <AuthForm mode={mode} onSuccess={() => navigate('/dashboard')} />
        </div>
      </main>
    </div>
  );
};

export default Auth;
