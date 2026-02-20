import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Forgot Password',
};

export default function ForgotPasswordPage() {
  return (
    <Container>
      <ForgotPasswordForm />
    </Container>
  );
}
