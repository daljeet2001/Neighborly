'use client';

import React, { useState } from 'react';


export default function ServiceCard({ service }: { service: any }) {


  return (
    <article className="bg-white p-4 rounded shadow relative">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{service.title}</h3>
          <p className="text-sm text-gray-700 mt-1">{service.description}</p>
          <div className="text-xs text-gray-500 mt-2">
            By: {service.user?.name ?? service.user?.email}
          </div>
        </div>
        <div className="text-sm font-medium">{service.price ? `₹${service.price}` : '—'}</div>

      </div>


    </article>
  );
}
