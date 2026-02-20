import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth';
import { Container } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Reset Password',
};

export default function ResetPasswordPage() {
  return (
    <Container>
      <ResetPasswordForm />
    </Container>
  );
}
