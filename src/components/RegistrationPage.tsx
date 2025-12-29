import React, { useState } from "react";
import { useExam } from "../context/ExamContext";
import { checkRollNumber } from "../services/api";
import { toast } from "sonner";
import gnitsLogo from "../assets/gnits-logo.webp";

const RegistrationPage = () => {
  const { setStudentInfo, setCurrentPage } = useExam();
  const [formData, setFormData] = useState({
    rollNumber: "",
    name: "",
    department: "",
    section: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateRollNumber = (value: string): boolean => {
    // Must be exactly 10 characters, alphanumeric, uppercase only
    const regex = /^[A-Z0-9]{10}$/;
    return regex.test(value);
  };

  const handleRollNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    setFormData({ ...formData, rollNumber: value });
    
    if (value && !validateRollNumber(value)) {
      setErrors({ ...errors, rollNumber: "Roll number must be 10 alphanumeric characters (A-Z, 0-9)" });
    } else {
      const newErrors = { ...errors };
      delete newErrors.rollNumber;
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.rollNumber) {
      newErrors.rollNumber = "Roll number is required";
    } else if (!validateRollNumber(formData.rollNumber)) {
      newErrors.rollNumber = "Roll number must be 10 alphanumeric characters";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.department) {
      newErrors.department = "Please select a department";
    }
    
    if (!formData.section) {
      newErrors.section = "Please select a section";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const exists = await checkRollNumber(formData.rollNumber);
      if (exists) {
        toast.error("This roll number has already submitted the exam!");
        setIsSubmitting(false);
        return;
      }
      
      setStudentInfo(formData);
      setCurrentPage("exam");
      toast.success("Registration successful! Starting exam...");
    } catch {
      toast.error("Error checking roll number. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen gradient-sunset flex flex-col">
      {/* Header with Logo */}
      <header className="w-full p-4 flex justify-between items-center">
        <div></div>
        <img
          src={gnitsLogo}
          alt="GNITS Logo"
          className="h-20 w-auto object-contain"
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          {/* Card */}
          <div className="bg-card rounded-2xl shadow-card p-8 border-2 border-primary/20">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-primary">
                Online Examination
              </h1>
              <p className="text-muted-foreground mt-2">
                Please enter your details to begin
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Roll Number */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={handleRollNumberChange}
                  placeholder="e.g., 23251A6601"
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 uppercase ${
                    errors.rollNumber ? "border-destructive" : "border-input hover:border-primary/50"
                  }`}
                />
                {errors.rollNumber && (
                  <p className="text-destructive text-sm mt-1">{errors.rollNumber}</p>
                )}
                <p className="text-muted-foreground text-xs mt-1">
                  10 characters, letters and numbers only (e.g., 23251A6601)
                </p>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                    errors.name ? "border-destructive" : "border-input hover:border-primary/50"
                  }`}
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                    errors.department ? "border-destructive" : "border-input hover:border-primary/50"
                  }`}
                >
                  <option value="">Select Department</option>
                  <option value="CSE(AI&ML)">CSE (AI & ML)</option>
                  <option value="CSE(Data Science)">CSE (Data Science)</option>
                </select>
                {errors.department && (
                  <p className="text-destructive text-sm mt-1">{errors.department}</p>
                )}
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Section
                </label>
                <select
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
                    errors.section ? "border-destructive" : "border-input hover:border-primary/50"
                  }`}
                >
                  <option value="">Select Section</option>
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
                {errors.section && (
                  <p className="text-destructive text-sm mt-1">{errors.section}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-lg font-bold text-lg gradient-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? "Verifying..." : "Start Exam"}
              </button>
            </form>

            {/* Info */}
            <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/30">
              <p className="text-sm text-accent font-medium flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Time Limit: 5 Minutes | 10 Questions
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;
