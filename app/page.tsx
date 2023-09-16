'use client'

import {Tabs, Tab} from "@nextui-org/react";
import FormHsGol from './components/form/formulario'
import React from "react";
import {Card, CardBody} from "@nextui-org/react";
import { UserIcon, PresentationChartBarIcon, HomeModernIcon} from "@heroicons/react/24/solid";

export default function Home() {
  let tabs = [
    {
      id: "dashboard",
      label: "Reporte",
      icon: <PresentationChartBarIcon className="mx-auto h-6 w-6 text-white-200" aria-hidden="true" />,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
    },
    {
      id: "cliente",
      label: "Cliente",
      icon: <UserIcon className="mx-auto h-6 w-6 text-white-200" aria-hidden="true" />,
      content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
      id: "habitacion",
      label: "Habitación",
      icon: <HomeModernIcon className="mx-auto h-6 w-6 text-white-200" aria-hidden="true" />,
      content: <FormHsGol />
    }
  ];
  return (
    <section id='habitacionDisponible' className='py-10'>
      <div className='container flex items-center justify-center '>
      <div className="flex w-full flex-col">
      <Tabs aria-label="Options" size="md" radius="sm" color="primary" variant="bordered" items={tabs}>
        {(item) => (
          <Tab key={item.id} title={
            <div className="flex items-center space-x-2">
              {item.icon}
              <span>{item.label}</span>
            </div>
          }>
            <Card>
              <CardBody>
                {item.content}
              </CardBody>
            </Card>  
          </Tab>
        )}
      </Tabs>
    </div>  
        
      </div>
    </section>
  )
}
