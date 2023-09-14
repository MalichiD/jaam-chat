import Image from 'next/image';
import { Button } from '@/components/ui/button';
export default function Home() {
  return (
    <div>
      <p className="text-3xl font-bold text-indigo-500">Hello!</p>
      <Button className='bg-indigo-500'>Click Me</Button>
    </div>
  )
}
