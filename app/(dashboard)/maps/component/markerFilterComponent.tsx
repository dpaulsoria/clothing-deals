import { motion, AnimatePresence } from 'framer-motion';
import { EDAD_IGUANA, SEXO, ESTADOS_IGUANA } from '@lib/interfaces';
import React, { useState, useRef } from 'react';
import { colorMapping } from '@lib/utils';

type OptionType = {
  label: string;
  value: string;
  options: string[];
};

const options: OptionType[] = [
  { label: 'Estado', value: 'estado', options: ESTADOS_IGUANA },
  { label: 'Edad', value: 'edad', options: EDAD_IGUANA },
  { label: 'Sexo', value: 'sexo', options: SEXO },
];

interface DropdownOptionsProps {
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

const DropdownOptions: React.FC<DropdownOptionsProps> = ({
  options,
  selectedOptions,
  onToggle,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 bg-white rounded-lg shadow-lg border border-gray-300 p-2"
    >
      {options.map((opt) => {
        return (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
          <div
            key={opt}
            className={`z-[9999] cursor-pointer rounded-lg mt-1 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center ${
              selectedOptions.includes(opt) ? 'bg-blue-100' : ''
            }`}
            onClick={(e) => {
              e.stopPropagation(); // Detiene la propagación del evento
              onToggle(opt);
            }}
          >
            <input
              type="checkbox"
              checked={selectedOptions.includes(opt)}
              onChange={() => {}} // Vacío para evitar advertencias
              className="mr-2 cursor-pointer"
            />
            <div className="flex w-full">
              <span className="mr-2 w-full">{opt}</span>
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: colorMapping[opt] }}
              ></div>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

interface MarkerFilterComponentProps {
  onFilterChange: (option: string, list: string[]) => void;
}

export default function MarkerFilterComponent({
  onFilterChange,
}: MarkerFilterComponentProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const actualState = useRef('estado');
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: string[];
  }>({
    estado: ESTADOS_IGUANA,
    edad: EDAD_IGUANA,
    sexo: SEXO,
  });

  const handleDropdownToggle = (optionValue: string) => {
    // Si el dropdown ya está activo, ciérralo
    if (activeDropdown === optionValue) {
      setActiveDropdown(null);
      return;
    }

    // Si es un nuevo dropdown, ábrelo y actualiza el estado actual
    actualState.current = optionValue;
    setActiveDropdown(optionValue);

    // Resetea las opciones de los otros dropdowns, pero no resetees el actual
    options.forEach((option) => {
      if (option.value !== optionValue) {
        setSelectedOptions((prevOptions) => ({
          ...prevOptions,
          [option.value]: prevOptions[option.value], // Mantén las selecciones anteriores
        }));
      }
    });

    // Combina todas las opciones seleccionadas en una única lista
    const allSelectedOptions = [
      ...selectedOptions['estado'],
      ...selectedOptions['edad'],
      ...selectedOptions['sexo'],
    ];

    onFilterChange(actualState.current, allSelectedOptions);
  };

  const handleSubOptionToggle = (subOption: string) => {
    if (!activeDropdown) return;
    console.log('activeDropdown', activeDropdown);

    setSelectedOptions((prev) => {
      // Crea la nueva lista de subopciones para el dropdown activo
      const newSubOptions = prev[activeDropdown].includes(subOption)
        ? prev[activeDropdown].filter((opt) => opt !== subOption)
        : [...prev[activeDropdown], subOption];

      // Actualiza las opciones seleccionadas
      const updatedOptions = {
        ...prev,
        [activeDropdown]: newSubOptions,
      };

      // Combina todas las opciones seleccionadas usando el estado actualizado
      const allSelectedOptions = [
        ...updatedOptions['estado'],
        ...updatedOptions['edad'],
        ...updatedOptions['sexo'],
      ];

      // Envía la lista combinada a onFilterChange
      onFilterChange(actualState.current, allSelectedOptions);

      // Retorna el estado actualizado
      return updatedOptions;
    });
  };

  const currentOptions = () => {
    return activeDropdown
      ? options.find((opt) => opt.value === activeDropdown)?.options || []
      : [];
  };

  return (
    <div className="absolute top-4 left-4 z-[7000] flex space-x-4">
      {options.map((option) => (
        <motion.div
          key={option.value}
          className={`relative cursor-pointer  text-xs rounded-lg shadow-md border-2 transition-colors duration-300 ${
            activeDropdown === option.value
              ? 'border-blue-500 bg-blue-100  px-2 py-1 '
              : 'border-gray-300 bg-white hover:bg-gray-100 max-h-7'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions */}
          <div
            className="px-2 py-1 flex flex-row gap-2"
            onClick={(e) => {
              e.stopPropagation();
              handleDropdownToggle(option.value);
            }}
          >
            <span className="text-gray-700  font-medium">{option.label}</span>
            {selectedOptions[option.value].length < option.options.length && (
              <small className="ml-1 bg-blue-500 text-white rounded-full w-4 h-4 text-xs  flex items-center justify-center ">
                {selectedOptions[option.value].length}
              </small>
            )}
          </div>

          <AnimatePresence>
            {activeDropdown === option.value && (
              <DropdownOptions
                options={currentOptions()}
                selectedOptions={selectedOptions[option.value]}
                onToggle={handleSubOptionToggle}
              />
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
