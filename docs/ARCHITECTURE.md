# VisionShield Architecture

## Privacy-Preserving On-Device Visual Perception for Lightweight Browser Agents

**Project:** VisionShield  
**Smart India Hackathon:** Problem Statement 171  
**Organization:** Indian Space Research Organisation (ISRO)  
**Category:** Software

---

## 1. Project Overview

VisionShield is a privacy-preserving browser-agent architecture designed around a strict security principle:

> Sensitive information must be detected and protected locally before browser state is exposed to any remote AI reasoning system.

The system combines local browser perception with local privacy analysis and remote reasoning.

The intended high-level flow is:

```text
Browser State
     │
     ▼
┌─────────────────────────────┐
│ Local Perception Layer      │
│                             │
│ • DOM perception            │
│ • OCR                       │
│ • Visual perception         │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Local Privacy Layer         │
│                             │
│ • PII detection             │
│ • Sensitive-data detection  │
│ • Confidence scoring        │
│ • Privacy fusion            │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│ Local Redaction Layer       │
│                             │
│ • Blur                       │
│ • Mask                       │
│ • Semantic redaction        │
│ • Context sanitization      │
└──────────────┬──────────────┘
               │
               ▼
        Sanitized Context
               │
               ▼
┌─────────────────────────────┐
│ Remote Reasoning Layer      │
│                             │
│ • VLM / LLM                 │
│ • Task reasoning            │
│ • Action planning           │
└──────────────┬──────────────┘
               │
               ▼
        Structured Action
               │
               ▼
┌─────────────────────────────┐
│ Local Action Layer          │
│                             │
│ • Validation                │
│ • Safety checks             │
│ • Browser execution         │
└─────────────────────────────┘
