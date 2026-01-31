# 🚨 SMS Notification Setup with Twilio

## Installation Required

Before the SMS feature works, you need to install Twilio:

```bash
cd server
npm install twilio
```

**OR** if npm doesn't work due to execution policy:

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy RemoteSigned`
3. Then run: `npm install twilio`

## Configuration

The Twilio credentials are already configured in `.env`:

```env
TWILIO_SID=YOUR_TWILIO_SID
TWILIO_TOKEN=YOUR_TWILIO_TOKEN
TWILIO_PHONE=YOUR_TWILIO_PHONE
DOCTOR_PHONE=YOUR_DOCTOR_PHONE
```

## How It Works

### When HIGH Urgency is Detected:

1. **SMS is sent to**: +918019921150
2. **SMS includes**:
   - 🚨 Urgent alert indicator
   - Patient name and contact
   - Urgency level
   - Symptoms description
   - Top 2 AI recommendations
   - Meeting link for immediate video call
   - Appointment ID

### SMS Format:

```
🚨 URGENT MEDICAL CASE

Patient: [Name]
Contact: [Phone]
Urgency: HIGH

Symptoms: [Description]

AI Recommendations:
1. [Recommendation 1]
2. [Recommendation 2]

Join Video Call NOW:
[Meeting Link]

Appointment ID: [ID]

- JanJeevan Health
```

## Server Logs

When SMS is sent successfully:

```
📱 SMS Sent Successfully!
SMS SID: SM...
To: +918019921150
Status: queued
```

## Testing

1. **Install Twilio** (see above)
2. **Restart the server**
3. Go to AI Symptom Checker
4. Enter severe symptoms
5. If urgency is HIGH:
   - SMS will be sent to +918019921150
   - Server logs will show SMS status
   - Frontend shows success message

## Troubleshooting

### If SMS fails to send:

1. **Check Twilio credentials** in `.env`
2. **Verify phone number format**: Must include country code (+91...)
3. **Check Twilio account balance**
4. **View server logs** for error details

### Common Errors:

- **"Cannot find module 'twilio'"**: Run `npm install twilio`
- **"Invalid phone number"**: Ensure format is +918019921150
- **"Authentication failed"**: Check TWILIO_SID and TWILIO_TOKEN

## API Response

**Success:**
```json
{
  "success": true,
  "message": "Urgent notification sent via SMS",
  "sms": {
    "sid": "SM...",
    "to": "+918019921150",
    "status": "queued"
  }
}
```

**SMS Failed (but logged):**
```json
{
  "success": true,
  "message": "Urgent notification logged (SMS failed to send)",
  "smsError": "Error message"
}
```

## Next Steps

After installing Twilio and restarting the server, the SMS feature will be fully functional!
