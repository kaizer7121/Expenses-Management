import { useState } from "react";

const Test = () => {
  return (
    <section class="h-96 inline-block bg-gray-100 justify-center items-center">
      <div class="absolute w-48 h-48 rounded-lg bg-green-500"></div>
      <div class="absolute w-48 h-48 rounded-lg bg-blue-500"></div>
      <div class="absolute w-48 h-48 rounded-lg bg-yellow-500"></div>
      <div class="absolute w-48 h-48 rounded-lg bg-purple-500"></div>
      <div class="absolute transform -translate-x-4 w-48 h-48 rounded-lg bg-pink-500"></div>
    </section>
  );
};

export default Test;
