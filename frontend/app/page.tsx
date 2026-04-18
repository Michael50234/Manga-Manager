'use client';

import Image from "next/image";
import styles from "./page.module.css";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/manga?page=1&limit=10`)

        if(!response.ok) {
          throw new Error("Failed to fetch manga");
        }

        const data = await response.json();

        console.log(data)
      } catch(error) {
        console.error(error)
      }
    }

    fetchData();
  }, [])

  return (
    <div className={styles.page}>
      <h1>Hello</h1>
    </div>
  );
}
