import React, { createContext, useContext, useEffect, useState } from 'react';
import { configService, MarketplaceConfig } from '../../services/configService';

interface ConfigContextType {
  config: MarketplaceConfig | null;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType>({ config: null, isLoading: true });

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<MarketplaceConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const result = await configService.getMarketplaceConfig();
        if (isMounted) {
          setConfig(result);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load marketplace config:', err);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  return <ConfigContext.Provider value={{ config, isLoading }}>{children}</ConfigContext.Provider>;
};

export const useConfig = (): ConfigContextType => useContext(ConfigContext);
