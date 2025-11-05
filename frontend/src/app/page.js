
// src/app/page.js

"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    window.location.replace(token ? "/chat" : "/login");
  }, []);
  return null;
}