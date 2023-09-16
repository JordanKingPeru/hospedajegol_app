'use client'

import React from 'react'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Input,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar
} from '@nextui-org/react'
import { SearchIcon } from './SearchIcon' // Asegúrate de que SearchIcon también sea un archivo TSX
import Image from 'next/image'
import ThemeSwitch from '../ThemeSwitcher'

const NavBarHs: React.FC = () => {
  return (
    <Navbar isBordered isBlurred maxWidth='xl'>
      <NavbarContent justify='start'>
        <NavbarBrand className='mr-4'>
          <Link href='/'>
            <Image
              alt='Shoe'
              width={150}
              height={50}
              className='hidden dark:block'
              src='/logoHSGolHorizontalBlanco.svg'
            />
            <Image
              alt='Shoe'
              width={150}
              height={50}
              className='block dark:hidden'
              src='/logoHSGolHorizontalColor.svg'
            />
          </Link>
          {/* <p className='hidden font-bold text-inherit sm:block'>ACME</p> */}
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as='div' className='items-center' justify='end'>
        <ThemeSwitch />
      </NavbarContent>
    </Navbar>
  )
}

export default NavBarHs
