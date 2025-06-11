
import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface Gym {
  id: string;
  name: string;
  location: string;
  address: string | null;
}

interface GymLocationSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const GymLocationSelector = ({ value, onValueChange }: GymLocationSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGyms();
  }, []);

  const fetchGyms = async () => {
    try {
      const { data, error } = await supabase
        .from('supported_gyms')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setGyms(data || []);
    } catch (err) {
      console.error('Error fetching gyms:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedGym = gyms.find(gym => `${gym.name} - ${gym.location}` === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedGym ? `${selectedGym.name} - ${selectedGym.location}` : "Select gym..."}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search gym..." />
          <CommandList>
            <CommandEmpty>No gym found.</CommandEmpty>
            <CommandGroup>
              {gyms.map((gym) => {
                const gymValue = `${gym.name} - ${gym.location}`;
                return (
                  <CommandItem
                    key={gym.id}
                    value={gymValue}
                    onSelect={(currentValue) => {
                      onValueChange(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === gymValue ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div>
                      <div className="font-medium">{gym.name}</div>
                      <div className="text-sm text-muted-foreground">{gym.location}</div>
                      {gym.address && (
                        <div className="text-xs text-muted-foreground">{gym.address}</div>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GymLocationSelector;
