# cs3250_group4 – Chrome Theme Generator Extension

## Team Members
- Jack Mahoney  
- Dustin Jones  
- Guillermo Jurado
- Moriah Lane  
- Jorge Medrano  

# Development Tooling Guide

This project uses **ESLint**, **Jest**, and **JSDoc** to ensure code quality, reliability, and maintainability.

---

## Prerequisites

Make sure you have:

- Node.js (v18+ recommended)
- npm (comes with Node)

Install all dependencies:
npm install

## ESLint:

npm run lint
- Analyze all JavaScript files
- Report formatting issues and rule violations

## Auto-Fix Fixable Issues:

npm run lint:fix
-   This will automatically correct issues that ESLint can safely fix.

## Configuration
Config file: eslint.config.mjs

Designed for:
-   Chrome MV3 extensions
-   Browser globals
-   Excludes vendor/minified files


##  Jest:

Run Tests:
npm test

Run Tests in Watch Mode:
npm run test:watch

## JSDoc:
Generate Documentation:
npm run docs
-   File will be in "docs/index.html"



