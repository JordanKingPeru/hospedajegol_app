'use client'

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@nextui-org/button';
import { Switch, useSwitch, VisuallyHidden, SwitchProps } from "@nextui-org/react";
import { SunIcon } from './SunIcon';
import { MoonIcon } from './MoonIcon';

const ThemeSwitch: React.FC<SwitchProps> = (props) => {
  const { setTheme } = useTheme();
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps
  } = useSwitch(props);

  useEffect(() => {
    isSelected ? setTheme('light') : setTheme('dark');
  }, [isSelected, setTheme]);

  const switchColor = isSelected ? "bg-red-100 hover:bg-red-200" : "bg-default-100 hover:bg-default-200";

  return (
    <div className="flex flex-col gap-2">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "w-8 h-8",
              "flex items-center justify-center",
              "rounded-lg",
              switchColor
            ],
          })}
        >
          {isSelected ? <SunIcon /> : <MoonIcon />}
        </div>
      </Component>
    </div>
  );
}

export default ThemeSwitch;
