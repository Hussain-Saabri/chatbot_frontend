# Dr. Nura AI - Professional Healthcare Assistant

![Dr. Nura AI](https://img.shields.io/badge/Status-Production-success)
![Next.js](https://img.shields.io/badge/Next.js-15+-black?logo=next.js)
![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)

Dr. Nura AI is a modern, high-performance healthcare chatbot frontend built with **Next.js 15+** and **React 19**. It features a premium, responsive interface designed for seamless healthcare interactions, supporting real-time AI streaming responses and persistent conversation history.

---

## ✨ Key Features

- 🏥 **Professional Healthcare UI**: Clean, medical-grade aesthetic with a focus on readability and accessibility.
- ⚡ **Real-time AI Streaming**: Smooth, character-by-character message streaming for a natural conversation feel.
- 💾 **Conversation History**: Persistent chat threads with the ability to switch between previous sessions.
- 🔐 **Secure Authentication**: Integrated login and signup flows for personalized healthcare tracking.
- 🌓 **Dynamic Theme System**: Support for multiple UI states and seamless transitions using Framer Motion.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile browsers.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Library**: [React 19](https://react.dev/)
- **Styling**: Vanilla CSS with modern Flexbox/Grid layouts
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.stevenly.me/)
- **Formatting**: React Markdown with GFM support

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd chatbot/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```text
src/
├── app/             # Next.js App Router (Pages & Layouts)
│   ├── login/       # Authentication - Login
│   ├── signup/      # Authentication - Signup
│   └── page.tsx     # Main Chat Interface
├── components/      # Reusable UI Components
│   ├── chat/        # Chat-specific components (Messages, Input, etc.)
│   ├── layout/      # Sidebar and Navigation components
│   └── common/      # Shared elements (Logos, Icons)
└── styles/          # Global and component-specific styling
```

---

## 📦 Deployment

This project is configured for **Static Site Generation (SSG)**. To create a production build:

```bash
npm run build
```

The output will be generated in the `out/` directory, which can be deployed to any static hosting service (Vercel, Netlify, AWS S3).

---

## 📄 License

This project is private and intended for internal use only.

---

Built with ❤️ by Hussain Saabri
