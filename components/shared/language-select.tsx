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
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
];

const LanguageSelect = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    // Remover el locale actual del pathname si existe
    const pathWithoutLocale = pathname.replace(/^\/es|^\/en/, '') || '/';
    
    // Si el nuevo locale es el por defecto (es), no agregar prefijo
    const newPath = newLocale === 'es' 
      ? pathWithoutLocale 
      : `/${newLocale}${pathWithoutLocale}`;
    
    router.push(newPath);
    router.refresh();
  };

  return (
    <Select value={locale} onValueChange={handleLanguageChange}>
      <SelectTrigger
        className={cn(
          "focus-visible:ring-0 border-0 bg-gray-200/75 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 !h-10 dark:text-white cursor-pointer data-[state=open]:bg-gray-300 dark:data-[state=open]:bg-slate-600 sm:max-w-[unset] max-w-[100px] px-3"
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
