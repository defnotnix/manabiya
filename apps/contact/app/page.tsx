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
          <span style={{ opacity: 0.5 }}>uhh...</span> you just found{" "}
          <span style={{ color: "var(--mantine-color-brand-6)" }}>zetsel.</span>
        </Text>
      </Container>
    </>
  );
}
