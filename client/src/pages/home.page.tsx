import Layout from "@/components/domain/layout";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import type { FC } from "react";
import { Link } from "wouter";

const HomePage: FC = () => {
  return (
    <Layout>
      <section className="py-20 flex justify-center flex-col space-y-16">
        <div>
          <h1 className="text-5xl tracking-tight font-extrabold text-center drop-shadow">
            Welcome to this simple todo app
          </h1>
          <h1 className="text-5xl tracking-tight font-extrabold text-center drop-shadow underline">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-800 via-slate-700 to-slate-500">
              Login to get started
            </span>
          </h1>
        </div>
        <Link href="/login" asChild>
          <Button className="self-center">
            <ArrowRightIcon className="w-4 h-4 mr-2" />
            Get started
          </Button>
        </Link>
      </section>
    </Layout>
  );
};

export default HomePage;
