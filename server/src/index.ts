import { createApp } from "./app.js";

const PORT = Number(process.env.PORT ?? 4000);

createApp().listen(PORT, () => {
  console.log(`API слушает на http://localhost:${PORT}`);
});
