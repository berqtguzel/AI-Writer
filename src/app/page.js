import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get('authToken');

  if (token) {
    redirect('/main');
  }
  else (
    redirect('/login'))

  return (
    <div>
   
    </div>
  );
}
