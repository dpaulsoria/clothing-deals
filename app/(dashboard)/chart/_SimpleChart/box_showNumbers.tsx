interface BoxShowNumbersProps {
  nombre: string;
  cantidad: number;
  color?: string;
}

export default function BoxShowNumbers({
  nombre,
  cantidad,
  color = 'bg-blue-500',
}: BoxShowNumbersProps) {
  return (
    <>
      <div
        className={`w-fit ${color}  text-white flex flex-row rounded-lg p-2  shadow-md justify-between`}
      >
        <div className="font-semibold">{nombre}:</div>
        <div className="px-2 text-right">{cantidad}</div>
      </div>
    </>
  );
}
