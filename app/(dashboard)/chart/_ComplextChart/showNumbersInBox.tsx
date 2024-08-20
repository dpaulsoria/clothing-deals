import React, { useState, useEffect } from 'react';
import { Iguana } from '@lib/interfaces';
import BoxShowNumbers from '../_SimpleChart/box_showNumbers';
import { setColorListChart } from '@/app/_lib/utils';

interface ShowNumbersInBoxProps<V extends string> {
  data: [V, number][];
}

export default function ShowNumbersInBox<V extends string>({
  data,
}: ShowNumbersInBoxProps<V>) {
  const tailwindClasses = Object.keys(setColorListChart);
  if (!data) {
    return <div>Cargando...</div>;
  }

  return (
    <div className=" flex flex-wrap gap-2 justify-start">
      {data.map(([key, cantidad], index) => (
        <BoxShowNumbers
          key={key}
          nombre={key}
          color={tailwindClasses[index % tailwindClasses.length]}
          cantidad={cantidad}
        />
      ))}
    </div>
  );
}
