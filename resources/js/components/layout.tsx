import { useEffect } from "react";
import { usePage } from "@inertiajs/react";

import "css/layout.css";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";

/**
 * open AuthController.go to see how flash message is used
 * this toast component for demo purpose to use flash message
 */
const Toast = () => {
  const { flash } = usePage().props;

  useEffect(() => {
    if (!flash) return;

    if (flash.type === "success") {
      toast.success(flash.message);
    } else if (flash.type === "error") {
      toast.error(flash.message);
    } else {
      toast.info(flash.message);
    }
  }, [flash]);

  return null;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster />

      <Toast />

      <main className="min-h-screen flex flex-col py-12">{children}</main>
    </>
  );
}
