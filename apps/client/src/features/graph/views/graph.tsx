import { Label } from '@/shared/components/ui/label'
import { 
  Select, 
  SelectTrigger,
  SelectValue,
  SelectGroup, 
  SelectContent,
  SelectItem,
} from '@/shared/components/ui/select'

const floorsNumber = 16
const sensor = [  
  { value: 'temperature', label: 'Température' },
  { value: 'brightness', label: 'Luminosité' },
  { value: 'waterleak', label: 'Fuite d\'eau' },
  { value: 'co2', label: 'Capteur de Co2' },
  { value: 'aled', label: 'Alllleeed' }]

export function Graph() {

  const floors = Array.from({ length: floorsNumber }, (_, index) => ({
    value: `floor${index + 1}`,
    label: `Étage ${index + 1}`,
  }))

  return (
    <div className='px-16 pt-20'>
      <div className='flex flex-col gap-4 mb-14'>
        <h1 className="font-extrabold text-5xl
          balance-text whitespace-pre-line">
          Graphiques        
        </h1>
        <h4 className="font-normal text-xl">
          Visualisez l’ensemble de vos capteurs et dispositifs.        
        </h4>
      </div>
      <div className='flex gap-4'>
        <div>
          <Label>Période d’affichage</Label>
          <Select >
            <SelectTrigger className="w-[240px]">
              <SelectValue
                placeholder="Mois" 
              >
              </SelectValue>
            </SelectTrigger>
            <SelectContent className='max-h-60'>
              <SelectGroup>
                {floors.map((floor) => (
                  <SelectItem key={floor.value} value={floor.value}>
                    {floor.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Étage</Label>
          <Select >
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
          <Select >
            <SelectTrigger className="w-[240px]">
              <SelectValue
                placeholder="Mois" 
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
    </div>
  )
}
