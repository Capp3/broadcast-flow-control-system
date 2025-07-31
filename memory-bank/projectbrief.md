# Broadcast Management System - Project Brief

## Project Overview

The Broadcast Management System (BMS) is a comprehensive platform designed for media organizations to manage broadcast content, scheduling, and operations. The system enables broadcasters to efficiently organize content, create and maintain broadcast schedules, manage user permissions, and automate various aspects of the broadcasting workflow.

## Business Objectives

1. Streamline the management of broadcast content and scheduling
2. Reduce manual effort and human error in broadcast operations
3. Provide real-time visibility into broadcast schedules and content status
4. Enable efficient collaboration between different roles in broadcast organizations
5. Support compliance with broadcasting regulations through proper logging and audit trails
6. Integrate with external systems for content acquisition and playout

## Target Users

1. **Content Managers**: Responsible for organizing and managing broadcast content
2. **Broadcast Schedulers**: Create and maintain broadcast schedules
3. **Technical Operators**: Handle technical aspects of broadcasting
4. **Station Managers**: Oversee overall broadcast operations
5. **Administrators**: Manage system settings and user permissions

## Current Technical State

- Frontend is built with React, TypeScript, Vite, and Tailwind CSS
- The UI is functioning well without a backend currently
- Using React Router for navigation
- Authentication system is set up to work with Django but can be adapted
- UI components from Radix UI/shadcn
- State management through React Context
- Forms handled with React Hook Form and Zod validation

## Development Notes

- Keep the frontend as intact as possible in its current working state
- Backend implementation should respect the existing API contract
- Future implementation should maintain the same UI/UX flow 