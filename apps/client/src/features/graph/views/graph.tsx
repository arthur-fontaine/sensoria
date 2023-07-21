import { GraphCard } from './components/graph-card'
import { Label } from '@/shared/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectItem,
} from '@/shared/components/ui/select'
import { useQuery } from '@/shared/hooks/use-query'
import { useState } from 'react'

const sensor = [
  { value: 'tous_les_capteurs', label: 'Tous les capteurs' },
  { value: 'temperature', label: 'Température' },
  { value: 'brightness', label: 'Luminosité' },
  { value: 'waterleak', label: 'Fuite d\'eau' },
  { value: 'co2', label: 'Capteur de Co2' },
]

export function Graph() {

  const [time, setTime] = useState<string>();
  const [sensors, setSensors] = useState<string>();
  const [stages, setStages] = useState<string>();


  const objectSelect = {
    time: time,
    sensors: sensors,
    stages: stages,
  };

  const availableHalls = useQuery().halls.map(hall => hall.label)


  return (
    <div className='px-16 py-14'>
      <div className='flex flex-col gap-4 mb-14'>
        <h1 className="text-5xl font-extrabold whitespace-pre-line balance-text">
          Graphiques
        </h1>
        <h4 className="text-xl font-normal">
          Visualisez l’ensemble de vos capteurs et dispositifs.
        </h4>
      </div>
      <div className='flex gap-4 mb-14'>
        <div>
          <Label>Hall</Label>
          <Select onValueChange={(value) => setStages(value)}>
            <SelectTrigger className="w-[240px]">
              <SelectValue
                placeholder="Hall">
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='max-h-60'>
              <SelectGroup>
                {availableHalls.map((availableHall) => (
                  availableHall && <SelectItem key={availableHall} value={availableHall}>
                    {availableHall}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Période d’affichage</Label>
          <Select onValueChange={(value) => setTime(value)}>
            <SelectTrigger className="w-[240px]">
              <SelectValue
                placeholder="Mois"
              >
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="day">Jour</SelectItem>
                <SelectItem value="Week">Semaine</SelectItem>
                <SelectItem value="Month">Mois</SelectItem>
                <SelectItem value="Year">Année</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Capteur</Label>
          <Select onValueChange={(value) => setSensors(value)}>
            <SelectTrigger className="w-[240px]">
              <SelectValue
                placeholder="Température"
              >
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='max-h-60'>
              <SelectGroup>
                {sensor.map((sensor, index) => (
                  <SelectItem key={index} value={sensor.value}>
                    {sensor.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className=''>
        <GraphCard objectSelect={objectSelect} />
      </div>
    </div>
  )
}

