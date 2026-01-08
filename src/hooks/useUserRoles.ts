import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

type AppRole = 'admin' | 'seller' | 'buyer';

export function useUserRoles() {
  const { user, isLoading: authLoading } = useAuth();
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchRoles = async () => {
      // Wait for auth to finish loading first
      if (authLoading) {
        return;
      }

      if (!user) {
        setRoles([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      if (cancelled) return;

      if (!error && data) {
        setRoles(data.map((r) => r.role as AppRole));
      } else {
        console.error('Failed to fetch user roles:', error);
        setRoles([]);
      }
      setIsLoading(false);
    };

    fetchRoles();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const hasRole = (role: AppRole) => roles.includes(role);
  const isSeller = () => roles.includes('seller');
  const isAdmin = () => roles.includes('admin');
  const isBuyer = () => roles.includes('buyer');

  return { roles, isLoading, hasRole, isSeller, isAdmin, isBuyer };
}
