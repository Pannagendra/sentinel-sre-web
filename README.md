<div align="center">

# 🛡️ Sentinel SRE

### Agentic Incident Investigation & Remediation — Web Platform

A multi-agent AI SRE copilot that **detects, investigates, and remediates** production incidents with a human in the loop. This repo is the web experience — dashboard, conversational investigation, integrations, and API surface.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

</div>

---

## 🎯 What It Does

Sentinel turns the SRE incident loop into an **agentic workflow**: telemetry comes in, agents triage and investigate autonomously, propose a fix, and act only after a human gate approves.

It's the AI SRE copilot pattern — built to cut MTTR and eliminate L0/L1 toil **without** handing production to a black box. Agents reason; the platform gates, acts, verifies, and audits.

---

## ⚡ Capabilities

| | |
|---|---|
| 🔍 **Autonomous Detection** | Agents surface and classify incidents from observability telemetry |
| 💬 **Intelligent Dialogue** | Conversational investigation — ask the system what's wrong |
| 🎯 **Surgical Remediation** | Scoped, reversible fixes, not blanket actions |
| 🕸️ **Multi-Agent Architecture** | Specialised agents coordinate on triage → root cause → fix |
| 📊 **Live Analytics** | Real-time incident and agent-activity dashboards |
| 🔌 **40+ Integrations** | Observability, ITSM, and alerting sources |
| 🧪 **Regression Testing** | Validate agent behaviour before it reaches prod |

---

## 🔌 Built for Enterprise Telemetry

Designed to sit on top of the observability and ITSM stack enterprises already run:

![Dynatrace](https://img.shields.io/badge/Dynatrace-1496FF?style=flat-square&logo=dynatrace&logoColor=white)
![ServiceNow](https://img.shields.io/badge/ServiceNow-62D84E?style=flat-square&logo=servicenow&logoColor=white)
![Prometheus](https://img.shields.io/badge/Prometheus-E6522C?style=flat-square&logo=prometheus&logoColor=white)
![Kubernetes](https://img.shields.io/badge/Kubernetes-326CE5?style=flat-square&logo=kubernetes&logoColor=white)

- **Dynatrace** — DQL-driven signal retrieval, multi-cluster entity context, OneAgent topology
- **ServiceNow** — incident creation, correlation, and suppression; closed-loop ticket lifecycle
- **Kubernetes / AKS** — workload and cluster-level remediation targets

---

## 🔐 Enterprise-Grade by Design

**Human Gates** (approval before any action) · **RBAC** · **Audit Trail** · **Team Isolation** · **Deploy Anywhere**

This is the part that matters for enterprise adoption: autonomy *with* governance. Agents propose; humans authorise; everything is logged and replayable.

---

## 🧭 Architecture at a Glance

```
Telemetry (Dynatrace / Prometheus)        ITSM (ServiceNow)
            │                                    ▲
            ▼                                    │
    ┌──────────────┐   ┌───────────────┐   ┌─────┴────────┐
    │  Detection   │──▶│ Investigation │──▶│ Remediation  │
    │    Agent     │   │   Agent(s)    │   │    Agent     │
    └──────────────┘   └───────────────┘   └──────┬───────┘
            │                  │                  │
            └──── Live Dashboard · Audit Trail ────┘
                               │
                    🧑 Human Gate (approve / reject)
```

---

## 🚀 Run Locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

Pages: `/` landing · `/dashboard` live analytics · `/chat` investigation · `/integrations` · `/api-docs`

**Stack:** `Next.js 16` · `React 19` · `TypeScript` · `Tailwind` · `shadcn/ui`

---

## ✍️ More

Architecture deep-dives on **[Medium](https://medium.com/@klpannagendra)** · Connect on **[LinkedIn](https://www.linkedin.com/in/pannagendra-kl-28113055/)**

<sub>Built by Panna — Agentic AI Platform Architect · Bangalore, India</sub>
