'use client';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react'; 

const LogoutButton = () => {
  const handleLogout = () => {
    signOut({ callbackUrl: '/' }); 
  };

  return (
    <Button
      onClick={handleLogout}
      className=""
    >
      <LogOut size={18} />
      Logout
    </Button>
  );
};

export default LogoutButton;
