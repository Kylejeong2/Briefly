import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface Website {
  url: string;
}

export default function ViewWebsitesTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [websites, setWebsites] = useState<Website[]>([]);

  const fetchWebsites = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/getWebsites', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch websites');
      }
      const data = await response.json();
      setWebsites(data.websites);
    } catch (error) {
      console.error('Error fetching websites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={fetchWebsites} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Display Websites'}
      </Button>
      {websites.length > 0 && (
        <ul>
          {websites.map((website, index) => (
            <li key={index}>{website.url}</li>
          ))}
        </ul>
      )}
    </div>
  );
}