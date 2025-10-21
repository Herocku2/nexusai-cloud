'use client';

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

const LanguageSelect = () => {
  // Sistema i18n temporalmente deshabilitado
  // Mostrar selector pero sin funcionalidad por ahora
  const [locale] = React.useState('es');

  return (
    <Select value={locale} disabled>
      <SelectTrigger
        className={cn(
          "focus-visible:ring-0 border-0 bg-gray-200/75 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 !h-10 dark:text-white cursor-not-allowed opacity-60 sm:max-w-[unset] max-w-[100px] px-3"
        )}
      >
        <SelectValue>
          <span className="flex items-center gap-2">
            <span className="text-xl">
              {languages.find(lang => lang.code === locale)?.flag}
            </span>
            <span className="hidden sm:inline">
              {languages.find(lang => lang.code === locale)?.name}
            </span>
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {languages.map((lang) => (
            <SelectItem 
              key={lang.code} 
              value={lang.code} 
              className="cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default LanguageSelect;
