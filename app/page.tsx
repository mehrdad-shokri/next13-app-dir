import Image from 'next/image'
import { redirect } from 'next/navigation';


export default function Home() {
  redirect('/notes')
  return <h1>this page does not exist</h1>
}
