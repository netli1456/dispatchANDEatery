import React from 'react';
import { MapPin, MoveDown, MoveRight, Search, ShoppingBag } from 'lucide-react';

const steps = [
  {
    icon: <MapPin className="w-6 h-6 text-green-600" />,
    title: 'Choose Location',
    description: 'Tell us where you are.',
    arrow: <MoveRight />,
    arrow2: <MoveDown />,
  },
  {
    icon: <Search className="w-6 h-6 text-green-600" />,
    title: 'Pick a Kitchen',
    description: 'Browse local menus.',
    arrow: <MoveRight />,
    arrow2: <MoveDown />,
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
    title: 'Place Your Order',
    description: 'Pay securely & order.',
    arrow: <MoveRight />,
    arrow2: <MoveDown />,
  },
  {
    icon: <ShoppingBag className="w-6 h-6 text-green-600" />,
    title: 'Get It Delivered',
    description: 'Track Delivery.',
  },
];

export default function HowItWorks() {
  return (
    <section className=" py-16 bg-white">
      <div className="max-w-7xl mx-auto py-6 text-center rounded-5 bg-green-100/100 ">
        {/* HEADER */}
        <span className="text-2xl md:text-3xl font-bold text-gray-900 ">
          How It Works
        </span>
        <p className="text-gray-600 mb-3">
          Getting your favorite local meals is simple and fast
        </p>

        {/* STEPS */}

        <div className="grid md:grid-cols-4  rounded gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row  items-center justify-center gap-6 border"
            >
              {/* STEP CONTENT */}
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-10 h-10 flex items-center justify-center bg-green-600 text-white rounded-full mb-2">
                  {index + 1}
                </div>

                <div className="w-12 h-12 flex items-center justify-center bg-green-100 rounded-full mb-4">
                  {step.icon}
                </div>

                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>

                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

             
              {index !== steps.length - 1 && (
                <div className="hidden md:flex items-center text-green-600 text-2xl mt-2">
                  {step.arrow}
                </div>
              )}

              {index !== steps.length - 1 && (
                <div className="flex md:hidden items-center text-green-600 text-2xl mt-2">
                  {step.arrow2}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
