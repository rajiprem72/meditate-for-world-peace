function createMeditationForm() {

  // --- Create Form ---
  const form = FormApp.create("Meditate for World Peace – Registration Form");
  form.setTitle("Meditate for World Peace – Registration Form")
      .setDescription(
        "📅 Date: 21 December 2025\n" +
        "⏰ Time: 11:00 AM – 11:30 AM\n" +
        "💰 Donation: ₹99\n" +
        "Please complete the donation via the Razorpay Payment Link shown below.\n\n" +
        "After payment, return to this form and enter your Payment ID.\n" +
        "An E-Certificate will be issued upon event completion and verification."
      )

  // --- Personal Details Section ---
  form.addPageBreakItem().setTitle("1. Personal Details");

  form.addTextItem()
      .setTitle("Full Name (as required for certificate)")
      .setRequired(true);

  form.addTextItem()
      .setTitle("Age")
      .setRequired(true);

  form.addMultipleChoiceItem()
      .setTitle("Gender")
      .setChoices([
        form.createChoice("Male"),
        form.createChoice("Female"),
        form.createChoice("Other")
      ])
      .setRequired(true);

  form.addTextItem()
      .setTitle("Nationality")
      .setRequired(true);

  form.addTextItem()
      .setTitle("State / City")
      .setRequired(true);

  form.addTextItem()
      .setTitle("Mobile Number (must be same as WhatsApp)")
      .setRequired(true);

  form.addTextItem()
      .setTitle("Email ID")
      .setRequired(true);

  // --- Meditation Background Section ---
  form.addPageBreakItem().setTitle("2. Meditation Background");

  form.addMultipleChoiceItem()
      .setTitle("Are you currently practicing Meditation?")
      .setChoices([
        form.createChoice("Yes"),
        form.createChoice("No")
      ])
      .setRequired(true);

  form.addMultipleChoiceItem()
      .setTitle("If yes, how long have you been practicing meditation?")
      .setChoices([
        form.createChoice("Less than 1 month"),
        form.createChoice("1–6 months"),
        form.createChoice("6–12 months"),
        form.createChoice("1–3 years"),
        form.createChoice("More than 3 years")
      ])
      .setRequired(true);

  form.addMultipleChoiceItem()
      .setTitle("Do you believe meditation can create positive global impact?")
      .setChoices([
        form.createChoice("Yes"),
        form.createChoice("No")
      ])
      .setRequired(true);

  // --- Donation Section ---
  form.addPageBreakItem().setTitle("3. Donation Details");

  form.addParagraphTextItem()
      .setTitle("Donation Payment Instructions")
      .setHelpText(
        "Please click the Razorpay Payment Link below to complete your ₹99 donation:\n\n" +
        "🔗 PAYMENT LINK: <INSERT_RAZORPAY_LINK_HERE>\n\n" +
        "After completing the payment, copy your Razorpay Payment ID (e.g., pay_XXXXXXXXXXXX)\n" +
        "and paste it into the next question."
      )
      .setRequired(false);

  form.addTextItem()
      .setTitle("Razorpay Payment ID (Example: pay_XXXXXXXXXXXX)")
      .setRequired(true);

  // --- Agreement Section ---
  form.addPageBreakItem().setTitle("4. Event Agreement");

  form.addCheckboxItem()
      .setTitle("Please confirm the following:")
      .setChoices([
        form.createChoice("I will join the meditation on December 21, 2025 from 11:00 AM to 11:30 AM"),
        form.createChoice("I understand this is a World Record attempt by Global Book of Yoga Records"),
        form.createChoice("I agree that my participation may be used for documentation purposes"),
        form.createChoice("I agree to receive the event link and certificate on WhatsApp/Email")
      ])
      .setRequired(true);

  // --- Pledge Section ---
  form.addPageBreakItem().setTitle("5. Pledge");

  form.addParagraphTextItem()
      .setTitle("Pledge Statement")
      .setHelpText("Type your full name below as a pledge:\n\n“I hereby pledge to contribute to World Peace and Harmony by joining this massive global meditation.”")
      .setRequired(true);

  // --- Final Message ---
  form.setConfirmationMessage(
    "Thank you for registering!\n" +
    "Your Registration ID will be generated shortly. Please check your email for confirmation.\n\n" +
    "Om Shanti 🙏"
  );

  Logger.log("Form created successfully: " + form.getEditUrl());
  Logger.log("Public Link: " + form.getPublishedUrl());
}
