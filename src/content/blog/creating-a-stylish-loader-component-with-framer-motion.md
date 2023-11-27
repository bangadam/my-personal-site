---
author: Muhammad Adam
pubDatetime: 2023-11-27T05:17:19Z
title: Creating a Stylish Loader Component with Framer Motion
postSlug: creating-a-stylish-loader-component-with-framer-motion
featured: false
draft: false
tags:
  - React
  - Framer Motion
  - Animation
  - Web Development
  - Frontend
description: In this tutorial, we’ll walk through the code for a stylish loader component using React and Framer Motion. This loader is designed to provide a visually appealing loading animation for your web applications
---

## Creating a Stylish Loader Component with Framer Motion

In this tutorial, we’ll walk through the code for a stylish loader component using React and Framer Motion. This loader is designed to provide a visually appealing loading animation for your web applications.

## Getting Started

Firstly, make sure you have React and Framer Motion installed in your project:

```bash
    npm install react framer-motion
```

Now, let’s dive into the loader component.

## 1. Importing Dependencies

In the loader.jsx file, we begin by importing the necessary modules:

```jsx
import { motion } from "framer-motion";
```

We’re using Framer Motion for animations, so make sure to install it and import it into your project.

## 2. Styling the Loader

Next, we define the styles for our loader. The loadingContainer and loadingCircle objects contain CSS-like styles to create the structure of our loader.

```jsx
const loadingContainer = {
  width: "4rem",
  height: "4rem",
  display: "flex",
  justifyContent: "space-around",
};

const loadingCircle = {
  display: "block",
  width: "1rem",
  height: "1rem",
  backgroundColor: "#3A36DB",
  borderRadius: "0.5rem",
};
```

Adjust the values according to your design preferences.

## 3. Animation Variants

We define animation variants for the loader and its circles using the loadingContainerVariants and loadingCircleVariants objects.

```jsx
const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: "0%",
  },
  end: {
    y: "60%",
  },
};
```

These variants control the animation behavior, providing a smooth and visually pleasing loading effect.

## 4. Animation Transition

We set up the transition properties for the loading circles using the loadingCircleTransition object:

```jsx
const loadingCircleTransition = {
  duration: 0.4,
  yoyo: Infinity,
  ease: "easeInOut",
};
```

This creates a looping animation for the circles.

## 5. Loader Component

Finally, we define the Loader component, utilizing the styles and animations we've set up:

```jsx
const Loader = () => {
  return (
    <div>
      {/* Background overlay */}
      <div className="bg-black fixed z-50 min-h-screen w-full opacity-30">
        <div className="fixed flex h-screen w-full items-center justify-center">
          {/* Loading animation */}
          <motion.div
            style={loadingContainer}
            variants={loadingContainerVariants}
            initial="start"
            animate="end"
          >
            <motion.span
              style={loadingCircle}
              variants={loadingCircleVariants}
              transition={loadingCircleTransition}
            ></motion.span>
            <motion.span
              style={loadingCircle}
              variants={loadingCircleVariants}
              transition={loadingCircleTransition}
            ></motion.span>
            <motion.span
              style={loadingCircle}
              variants={loadingCircleVariants}
              transition={loadingCircleTransition}
            ></motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
```

This component renders a background overlay and the loading animation using Framer Motion.

## Conclusion

You’ve now created a stylish loader component using React and Framer Motion. Feel free to customize the styles and animations to fit your project’s design. Happy coding!
