
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
      const { data, error } = await supabase
        .from('supported_gyms')
        .select('*')
        .eq('is_active', true)
        .order('name');

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
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy-orange mx-auto"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-planet-purple to-energy-yellow bg-clip-text text-transparent">
            Supported Gyms
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find your gym buddies at these partner locations across the country
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gyms.map((gym) => (
            <Card key={gym.id} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-r from-energy-orange to-electric-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                {gym.logo_url ? (
                  <img src={gym.logo_url} alt={gym.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  '🏋️'
                )}
              </div>
              <h3 className="text-lg font-bold mb-2">{gym.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{gym.location}</p>
              {gym.address && (
                <p className="text-xs text-muted-foreground">{gym.address}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SupportedGyms;
