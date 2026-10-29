import express from "express";
import cookieParser from "cookie-parser";

import medicalRecordRoutes from "./routes/medicalRecord.routes.js";
import prescriptionRoutes from "./routes/prescription.routes.js";
import referralRoutes from "./routes/referral.routes.js";
import consentRoutes from "./routes/consent.routes.js";
import auditLogRoutes from "./routes/auditLog.routes.js";

import departmentRoutes from "./routes/department.routes.js";
import specializationRoutes from "./routes/specialization.routes.js";
import emergencyContactRoutes from "./routes/emergencyContact.routes.js";
import appointmentRoutes from "./routes/appointment.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import searchRoutes from "./routes/search.routes.js";

import authRoutes from "./routes/auth.routes.js";
import hospitalRoutes from "./routes/hospital.routes.js";

const app = express();

// ==========================================
// GLOBAL MIDDLEWARE
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ==========================================
// ROUTES
// ==========================================

app.use(
  "/api/v1/medical-records",
  medicalRecordRoutes
);

app.use(
  "/api/v1/prescriptions",
  prescriptionRoutes
);

app.use(
  "/api/v1/referrals",
  referralRoutes
);

app.use(
  "/api/v1/consents",
  consentRoutes
);

app.use(
  "/api/v1/audit-logs",
  auditLogRoutes
);

app.use(
  "/api/v1/departments",
  departmentRoutes
);

app.use(
  "/api/v1/specializations",
  specializationRoutes
);

app.use(
  "/api/v1/emergency-contacts",
  emergencyContactRoutes
);

app.use(
  "/api/v1/appointments",
  appointmentRoutes
);

app.use(
  "/api/v1/notifications",
  notificationRoutes
);

app.use(
  "/api/v1/dashboard",
  dashboardRoutes
);

app.use(
  "/api/v1/search",
  searchRoutes
);

app.use(
  "/api/v1/auth",
  authRoutes
);

app.use(
  "/api/v1/hospitals",
  hospitalRoutes
);

// ==========================================
// HOME / HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HealthBridge Backend Running...",
  });
});

export default app;