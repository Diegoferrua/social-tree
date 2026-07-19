import { profile } from "@/config/profile";

export default function BackgroundGradient() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden bg-[#05050a]">
      <div
        className="blob blob-a absolute -left-40 -top-40 h-[38rem] w-[38rem]"
        style={{ background: profile.themeColor }}
      />
      <div
        className="blob blob-b absolute -right-32 top-1/3 h-[32rem] w-[32rem]"
        style={{ background: "#22d3ee" }}
      />
      <div
        className="blob blob-c absolute -bottom-40 left-1/3 h-[30rem] w-[30rem]"
        style={{ background: "#ec4899" }}
      />
    </div>
  );
}
