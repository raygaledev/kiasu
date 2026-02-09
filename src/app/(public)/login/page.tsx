import { AuthForm } from "@/components/auth";
import { Container } from "@/components/ui";

export default function LoginPage() {
  return (
    <Container>
      <AuthForm mode="login" />
    </Container>
  );
}
