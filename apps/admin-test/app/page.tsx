"use client";

import { Container, Text } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = ["for more", "for purpose", "framework"];

export default function () {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Container
        size="sm"
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Text
          fw={900}
          ta="center"
          size="3rem"
          lh="2.5rem"
          p="xl"
          style={{
            fontFamily: "Stack Sans Notch",
          }}
        >
          settle
          <br />
          <AnimatePresence mode="wait">
            <motion.span
              key={phraseIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "inline-block",
                color: phraseIndex == 2 ? "var(--mantine-color-brand-6)" : "",
              }}
            >
              {phrases[phraseIndex]}.
            </motion.span>
          </AnimatePresence>
        </Text>
      </Container>
    </>
  );
}
