const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate incoming contact form message submissions
 */
export function validateContact(req, res, next) {
  const { name, email, subject, message } = req.body;

  const errors = [];

  if (!name || typeof name !== "string" || !name.trim()) {
    errors.push("Name is required and cannot be empty.");
  } else if (name.trim().length > 100) {
    errors.push("Name cannot exceed 100 characters.");
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    errors.push("Email address is required.");
  } else if (!emailRegex.test(email.trim())) {
    errors.push("Please provide a valid email address.");
  } else if (email.trim().length > 254) {
    errors.push("Email cannot exceed 254 characters.");
  }

  if (!subject || typeof subject !== "string" || !subject.trim()) {
    errors.push("Subject is required and cannot be empty.");
  } else if (subject.trim().length > 150) {
    errors.push("Subject cannot exceed 150 characters.");
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    errors.push("Message body is required and cannot be empty.");
  } else if (message.trim().length > 5000) {
    errors.push("Message cannot exceed 5000 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: errors[0],
      errors,
    });
  }

  // Trimmed sanitized values
  req.body.name = name.trim();
  req.body.email = email.trim().toLowerCase();
  req.body.subject = subject.trim();
  req.body.message = message.trim();

  next();
}

/**
 * Validate admin login credentials payload
 */
export function validateLogin(req, res, next) {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter your admin email or username.",
    });
  }

  if (!password || typeof password !== "string" || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: "Please enter your password.",
    });
  }

  req.body.email = email.trim();
  next();
}
