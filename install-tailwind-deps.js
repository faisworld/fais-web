import { execSync } from "child_process"

try {
  console.log("Installing tailwindcss-animate...")
  execSync("npm install tailwindcss-animate --save", { stdio: "inherit" })

  console.log("Installing @tailwindcss/typography...")
  execSync("npm install @tailwindcss/typography --save", { stdio: "inherit" })

  console.log("Done! Tailwind dependencies installed successfully.")
} catch (error) {
  console.error("Error installing dependencies:", error)
}
