# 🚨 Urgent Case Email Notification System

## Overview
When the AI Symptom Checker detects a **HIGH urgency** case, the system automatically:
1. Creates an urgent appointment
2. Sends an email notification to the doctor
3. Starts a video consultation meeting

## How It Works

### Trigger Condition
- **Urgency Level**: HIGH
- Detected by AI analysis of patient symptoms

### Automatic Actions

#### 1. Email Notification
- **Recipient**: kp6080810@gmail.com
- **Subject**: 🚨 URGENT: High Priority Medical Case - [Patient Name]
- **Content Includes**:
  - Patient name and contact
  - Urgency level
  - Detailed symptoms
  - AI recommendations
  - Meeting link for immediate consultation
  - Appointment ID

#### 2. Meeting Creation
- Automatically generates a video call link
- Format: `/dashboard/asha/video-call/[appointmentId]`
- ASHA worker is redirected to the meeting
- Doctor receives the link via email

#### 3. Alert Display
When HIGH urgency is detected, the ASHA worker sees:
```
🚨 HIGH URGENCY CASE!

Appointment created and urgent notification sent to doctor at kp6080810@gmail.com

Connecting to video call...
```

## Email Template

```
URGENT MEDICAL CONSULTATION REQUIRED

Patient Information:
- Name: [Patient Name]
- Contact: [Phone Number]
- Urgency Level: HIGH

Symptoms:
[Detailed symptoms description]

AI Recommendations:
1. [Recommendation 1]
2. [Recommendation 2]
...

IMMEDIATE ACTION REQUIRED:
Please join the video consultation immediately using the link below:

Meeting Link: [Video Call URL]

Appointment ID: [ID]

This is an automated alert from JanJeevan Health System.
```

## Server Logs

When an urgent notification is sent, the server logs:

```
🚨 ===== URGENT MEDICAL CASE ALERT ===== 🚨
Appointment ID: [ID]
Patient: [Name]
Contact: [Phone]
Urgency Level: HIGH
Symptoms: [Description]
Recommendations: [List]
Meeting Link: [URL]
Doctor Email: kp6080810@gmail.com
========================================
```

## API Endpoint

**POST** `/appointments/send-urgent-notification`

**Request Body:**
```json
{
  "appointmentId": "string",
  "patientName": "string",
  "patientContact": "string",
  "symptoms": "string",
  "urgency": "HIGH",
  "recommendations": ["string"],
  "doctorEmail": "kp6080810@gmail.com",
  "meetingLink": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Urgent notification logged",
  "emailPreview": { ... }
}
```

## Future Enhancements

### Email Service Integration
To send actual emails, integrate with:
- **SendGrid**
- **AWS SES**
- **Nodemailer with SMTP**

Example integration:
```typescript
import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

await sendgrid.send({
  to: doctorEmail,
  from: 'noreply@janjeevan.health',
  subject: emailContent.subject,
  text: emailContent.body
});
```

## Testing

1. Go to AI Symptom Checker
2. Select a patient
3. Enter severe symptoms (e.g., "severe chest pain, difficulty breathing, dizziness")
4. Click "Analyze Symptoms"
5. If urgency is HIGH:
   - Alert message appears
   - Server logs show the notification
   - Meeting link is created
   - ASHA is redirected to video call

## Notes

- Currently logs email content to console (email service not configured)
- Meeting link is automatically generated
- Doctor email is hardcoded to: kp6080810@gmail.com
- Works only for HIGH urgency cases
