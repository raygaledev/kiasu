import { AuthForm } from '@/components/auth';
import { Container } from '@/components/ui';

export default function SignupPage() {
  return (
    <Container>
      <AuthForm mode="signup" />
    </Container>
  );
}
