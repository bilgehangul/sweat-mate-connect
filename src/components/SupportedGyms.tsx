import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
interface SupportedGym {
  id: string;
  name: string;
  location: string;
  address: string | null;
  logo_url: string | null;
}
const SupportedGyms = () => {
  const [gyms, setGyms] = useState<SupportedGym[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchSupportedGyms();
  }, []);
  const fetchSupportedGyms = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('supported_gyms').select('*').eq('is_active', true).order('name');
      if (error) {
        console.error('Error fetching supported gyms:', error);
      } else {
        setGyms(data || []);
      }
    } catch (err) {
      console.error('Error fetching supported gyms:', err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy-orange mx-auto"></div>
      </div>;
  }
  return;
};
export default SupportedGyms;