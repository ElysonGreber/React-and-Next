"use client";
import React from "react";
import styles from "./Coin.module.css";

export default function Coin() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={`${styles.coin} ${styles.euro}`}>
          <div className={`${styles.face} ${styles.front}`}>
          </div>
          <div className={`${styles.face} ${styles.back}`}>

          </div>

          {/* Lados da moeda */}
          {[...Array(20)].map((_, i) => (
            <figure
              key={i}
              className={styles.side}
              style={{
                transform: `translate3d(-50%, -50%, 0) rotateY(90deg) rotateX(${
                  i * 18
                }deg) translateZ(4.9em)`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}