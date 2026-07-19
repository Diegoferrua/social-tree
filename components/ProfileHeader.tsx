"use client";

import { motion } from "framer-motion";
import { profile } from "@/config/profile";

export default function ProfileHeader() {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex flex-col items-center gap-2 sm:gap-4"
      >
        <div
          className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-lg font-semibold text-white backdrop-blur-sm sm:h-24 sm:w-24 sm:text-2xl lg:h-28 lg:w-28"
          style={{ boxShadow: `0 0 60px 12px ${profile.themeColor}55` }}
        >
          {profile.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            profile.initials
          )}
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
            {profile.name}
          </h1>
          <p className="mt-1 text-xs font-medium text-white/50 sm:text-sm">{profile.handle}</p>
          <p className="mx-auto mt-2 max-w-xs text-xs text-white/70 sm:mt-3 sm:max-w-sm sm:text-sm">
            {profile.tagline}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
