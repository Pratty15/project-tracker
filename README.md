#  Project Tracker (Multi-View Task Management UI)

A fully functional frontend project management tool built with **React + TypeScript**.  
It supports multiple views, custom drag-and-drop, virtual scrolling, and simulated real-time collaboration.

---

##  Features

-  Kanban Board (custom drag-and-drop)
-  List View (virtual scrolling for 500+ tasks)
-  Timeline / Gantt View
-  Filters with URL sync (shareable & restorable)
-  Live collaboration simulation (moving avatars)
-  High performance (optimized rendering)

---

##  Tech Stack

- React + TypeScript
- Zustand (state management)
- Custom drag-and-drop (no libraries)
- Custom virtual scrolling (no libraries)
- CSS (no UI frameworks)

---

State Management (Why Zustand?)

Zustand was chosen because it provides a lightweight and simple global state solution without boilerplate.
It allows all three views (Kanban, List, Timeline) to share the same task data efficiently without prop drilling.
This ensures instant view switching without re-fetching data and keeps state updates predictable and performant.

 Drag-and-Drop Implementation

The drag-and-drop system was built from scratch using pointer events instead of external libraries.

Key aspects:

Floating drag preview follows cursor
Placeholder inserted to prevent layout shift
Drop detection based on cursor position using elementFromPoint
Snap-back behavior when dropped outside valid zones
Works for both mouse and touch devices

Virtual Scrolling Implementation

Virtual scrolling was implemented manually to handle large datasets efficiently.

Key aspects:

Only visible rows + buffer are rendered
Scroll height maintained using a spacer div
Offset calculated using translateY
Prevents flickering and blank gaps during fast scroll
Tested with 500+ tasks

 Filters + URL Sync
Filters update instantly (no submit button)
State synced with URL query parameters
Supports shareable links
Back navigation restores exact filter state

 Performance
Minimal DOM nodes using virtualization
Memoization to reduce re-renders
Optimized drag handling
Lighthouse score: 85+
<img width="1890" height="279" alt="image" src="https://github.com/user-attachments/assets/f5a9fd86-5a64-4404-8717-82de71146108" />


 Live Demo
[https://project-tracker-pink-beta.vercel.app/]

## ⚙️ Setup Instructions

```bash
npm install
npm run dev
