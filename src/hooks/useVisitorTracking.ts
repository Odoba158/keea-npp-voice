import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export function useVisitorTracking() {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per app load
    if (tracked.current) return;
    tracked.current = true;

    async function trackVisit() {
      try {
        // Get or generate a persistent visitor ID for this device
        let visitorId = localStorage.getItem('keea_visitor_id');
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem('keea_visitor_id', visitorId);
        }

        // Get basic device info (user agent)
        const deviceInfo = navigator.userAgent;

        // Insert visit record
        const { error } = await supabase.from('site_visits').insert([
          {
            visitor_id: visitorId,
            device_info: deviceInfo,
          }
        ]);

        if (error) {
          console.error("Failed to track visitor:", error);
        }
      } catch (err) {
        console.error("Visitor tracking error:", err);
      }
    }

    trackVisit();
  }, []);
}
