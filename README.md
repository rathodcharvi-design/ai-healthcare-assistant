# AI Healthcare Scheduling Assistant

## Overview
This project simulates how AI can automate healthcare appointment scheduling workflows.

It takes a user request, understands intent using AI, and simulates booking an appointment using a mock EHR system.

---

## What it does

- User enters a request like:
  "I need a dermatologist appointment tomorrow"
- AI extracts intent (specialty, date, reason)
- System checks availability (mock EHR)
- Appointment is confirmed

---

## Tech Stack

- Frontend: HTML + JavaScript  
- Backend: Cloudflare Workers  
- AI: OpenAI API  
- Data: Mock EHR (simulated scheduling system)

---

## Architecture

Frontend → Cloudflare Worker → OpenAI API → Mock EHR → Response

---

## Why I built this

To demonstrate how AI can move beyond chat and automate real workflows, similar to platforms like Assort.

---

## Demo

Backend API:
https://assort.charvi.buzz
