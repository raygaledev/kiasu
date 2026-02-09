import { Button, Container } from "@/components/ui";
import { BookOpen, Share2, CheckSquare, Users } from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: BookOpen,
    title: "Organize Your Studies",
    description:
      "Create structured study lists to keep track of everything you need to learn.",
  },
  {
    icon: CheckSquare,
    title: "Track Progress",
    description:
      "Mark items as completed and see your progress at a glance.",
  },
  {
    icon: Share2,
    title: "Share with Others",
    description:
      "Make your lists public and share your curated study resources.",
  },
  {
    icon: Users,
    title: "Learn Together",
    description:
      "Discover study lists from the community and learn from others.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-32">
        <Container className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Study smarter,{" "}
            <span className="text-primary">not harder</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Kiasu helps you create, organize, and share study lists so you never
            miss a thing. Stay ahead of the curve.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">Get started for free</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign in
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="border-t border-border py-20">
        <Container>
          <h2 className="text-center text-3xl font-bold">
            Everything you need to stay on track
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Simple tools to help you organize your learning journey.
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-20">
        <Container className="text-center">
          <h2 className="text-3xl font-bold">Ready to get started?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join Kiasu today and take control of your learning. It&apos;s free.
          </p>
          <div className="mt-8">
            <Link href="/signup">
              <Button size="lg">Create your account</Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
