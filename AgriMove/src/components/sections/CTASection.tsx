import { ArrowRight } from "lucide-react";
import { Btn } from "../ui/Btn";
import { useApp } from "../../context/AppContext";

export function CTASection() {
  const { goToLogin } = useApp();
  return (
    <section className="py-16 bg-[#72BF78]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-2xl lg:text-3xl font-medium text-white mb-3">
          Ready to reduce your post-harvest losses?
        </h2>
        <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.85)" }}>
          Join farmers, drivers, and buyers across East Africa already using AgriMove.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Btn variant="highlight" onClick={() => goToLogin("signup")} className="px-6 py-2.5">
            Create your account <ArrowRight size={14} />
          </Btn>
          <button
            className="text-white text-sm rounded-lg px-6 py-2.5 transition-colors hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.7)" }}
          >
            Talk to our team
          </button>
        </div>
      </div>
    </section>
  );
}
