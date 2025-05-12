import { Container } from "@/components/container";
import { Form } from "./components/form";
import { Result } from "./components/result";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "lucide-react";
import Layout from "@/components/layout";

export default function HomePage() {
  return (
    <Container className="m-auto flex flex-col gap-8">
      <div className="flex flex-col gap-4 items-center">
        <h1 className="text-3xl text-center font-bold">Combination Finder</h1>

        <p className="text-center text-sm text-gray-500">
          Cari kombinasi bilangan yang hasil penambahannya sama dengan x.
        </p>
      </div>

      <div>
        <Form />

        <div className="flex justify-center mt-6">
          <a href="https://github.com/vnxx/combination-finder" target="_blank">
            <Button variant="link" className="text-gray-800">
              <GithubIcon className="w-5 h-5" />
              Open source
            </Button>
          </a>
        </div>
      </div>

      <Result />
    </Container>
  );
}

HomePage.layout = (children: React.ReactNode) => <Layout children={children} />;
