import { RegisterForm } from '@/components/forms/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="space-y-6 py-12">
      <RegisterForm />
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="text-primary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
