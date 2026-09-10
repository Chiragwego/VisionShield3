# VisionShield Development Guide

## 1. Project Goal

VisionShield is a privacy-preserving browser agent built around local perception, local privacy enforcement, remote reasoning, and local browser control.

The implementation must prioritize:

1. Privacy
2. Security
3. Correctness
4. Modularity
5. Performance
6. Testability

---

## 2. Core Development Rule

Sensitive browser information must be processed locally before any remote request.

The architecture must follow:

```text
Browser
   ↓
Local Perception
   ↓
Local Privacy Detection
   ↓
Local Redaction
   ↓
Sanitized Context
   ↓
Remote Reasoning
   ↓
Structured Action
   ↓
Local Validation
   ↓
Browser
