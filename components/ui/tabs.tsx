'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

const Tabs = ({
  value: controlledValue,
  defaultValue,
  onValueChange,
  children,
  className,
}: TabsProps) => {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue || ''
  );

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : uncontrolledValue;

  const setValue = (next: string) => {
    if (!isControlled) {
      setUncontrolledValue(next);
    }
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  );
};

const useTabsContext = () => {
  const ctx = React.useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs components must be used within <Tabs>');
  }
  return ctx;
};

const TabsList = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'inline-flex items-center justify-start rounded-lg bg-gray-50 dark:bg-gray-900/60 p-1 gap-1',
      className
    )}
    {...props}
  />
);

TabsList.displayName = 'TabsList';

interface TabsTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

const TabsTrigger = ({
  className,
  value,
  children,
  ...props
}: TabsTriggerProps) => {
  const { value: activeValue, setValue } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      onClick={() => setValue(value)}
      className={cn(
        'px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer',
        isActive
          ? 'bg-white dark:bg-gray-800 text-[#009688] shadow-sm'
          : 'bg-transparent text-[#475467] hover:text-[#344054]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const TabsContent = ({
  className,
  value,
  children,
  ...props
}: TabsContentProps) => {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;

  return (
    <div className={cn('w-full', className)} {...props}>
      {children}
    </div>
  );
};

TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };

