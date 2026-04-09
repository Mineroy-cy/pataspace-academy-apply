import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { applicationSchema, defaultValues } from './schema';
import { getApiErrorMessage, notifyPaymentSent, submitApplication } from '../../api/client';
import toast from 'react-hot-toast';
import { CheckCircle2, ChevronRight, ChevronLeft, User, CheckSquare, Sparkles } from 'lucide-react';

const steps = [
  { id: 1, name: 'Personal Info' },
  { id: 2, name: 'Track & Experience' },
  { id: 3, name: 'Motivation & Commitments' },
  { id: 4, name: 'Review & Submit' }
];

const LOCAL_STORAGE_KEY = 'pataspace_application_draft';
const trackQueryValues = new Set(['backend', 'frontend', 'both']);

const countWords = (value = '') => value.trim().split(/\s+/).filter(Boolean).length;

const emptyToNull = (value) => {
  if (typeof value !== 'string') {
    return value ?? null;
  }

  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
};

const normalizePhone = (value) => value.replace(/\s+/g, '').replace(/^\+/, '');

const normalizePayload = (data) => ({
  ...data,
  fullName: data.fullName.trim(),
  phoneNumber: normalizePhone(data.phoneNumber),
  email: data.email.trim(),
  githubUsername: data.githubUsername.trim(),
  currentLevelOfStudy: data.currentLevelOfStudy || null,
  institution: emptyToNull(data.institution),
  vision: emptyToNull(data.vision),
  referralSource: emptyToNull(data.referralSource),
  attendanceConstraints: emptyToNull(data.attendanceConstraints),
  motivation: data.motivation.trim(),
});

const ApplicationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [paymentNoticeState, setPaymentNoticeState] = useState('idle');
  const [searchParams] = useSearchParams();

  const initialTrackParam = searchParams.get('track');
  const initialTrack = trackQueryValues.has(initialTrackParam) ? initialTrackParam : '';

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: { ...defaultValues, selectedTrack: initialTrack || defaultValues.selectedTrack },
    mode: 'onTouched'
  });

  const formValues = watch();
  const motivationWordCount = countWords(formValues.motivation || '');

  useEffect(() => {
    const draft = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        reset({
          ...defaultValues,
          ...parsed,
          selectedTrack: parsed.selectedTrack || initialTrack || defaultValues.selectedTrack,
        });
        return;
      } catch (error) {
        console.error('Failed to parse draft', error);
      }
    }

    reset({
      ...defaultValues,
      selectedTrack: initialTrack || defaultValues.selectedTrack,
    });
  }, [initialTrack, reset]);

  // Save to localStorage whenever form changes, unless submitted
  useEffect(() => {
    if (!submitResult) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formValues));
    }
  }, [formValues, submitResult]);

  const validateStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['fullName', 'phoneNumber', 'email', 'githubUsername', 'currentLevelOfStudy', 'institution', 'device'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['selectedTrack', 'experienceLevel'];
    } else if (currentStep === 3) {
      fieldsToValidate = ['motivation', 'vision', 'referralSource', 'attendanceConstraints', 'agreedToLaptop', 'agreedToAttendance', 'agreedToGitHub', 'agreedToFees', 'agreedToTerms'];
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setPaymentNoticeState('idle');
    try {
      const result = await submitApplication(normalizePayload(data));
      setSubmitResult(result);
      window.localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast.success("Application submitted successfully!");
      window.scrollTo(0, 0);
    } catch (error) {
      console.error(error);
      const errorMessage = getApiErrorMessage(error, 'Failed to submit application. Please try again.');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentNotification = async () => {
    if (!submitResult?.applicationId) {
      toast.error('Application reference not available yet.');
      return;
    }

    setPaymentNoticeState('loading');

    try {
      await notifyPaymentSent(submitResult.applicationId, {
        mpesaConfirmationSent: true,
        notes: 'Screenshot sent via WhatsApp',
      });
      setPaymentNoticeState('sent');
      toast.success('Payment notification recorded.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to record payment notification.'));
      setPaymentNoticeState('idle');
    }
  };

  if (submitResult) {
    return (
      <div className="max-w-2xl mx-auto pt-32 px-4 pb-24 text-center">
        <Helmet>
          <title>Application Received | PataSpace Academy</title>
        </Helmet>
        <div className="bg-brand-card border border-brand-mint/30 p-10 rounded-3xl shadow-[0_0_50px_rgba(2,195,154,0.1)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(2,195,154,0.12),transparent_40%)] pointer-events-none" />
          <div className="absolute top-8 right-8 w-24 h-24 rounded-full border border-brand-mint/20 animate-pulse pointer-events-none" />
          <div className="w-24 h-24 bg-brand-mint/20 rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
            <CheckCircle2 className="w-12 h-12 text-brand-mint" />
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 bg-brand-gold/10 px-4 py-1 text-brand-gold text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-4 h-4" />
            Application Received
          </div>
          <h1 className="text-4xl font-heading font-bold text-white mb-4">Application Received!</h1>
          <p className="text-white/60 font-sans mb-8">Ref: {submitResult.referenceNumber || 'PS-2026-PENDING'}</p>
          
          <div className="bg-black/30 rounded-xl p-6 mb-8 text-left border border-white/5">
            <h3 className="font-bold text-white mb-4 font-heading">Next Steps:</h3>
            <ul className="space-y-3 font-sans text-sm text-white/80">
              <li className="flex items-start gap-3">
                <span className="text-brand-mint font-bold">1.</span>
                Watch WhatsApp for confirmation message.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-mint font-bold">2.</span>
                Pay <span className="font-bold text-white">{submitResult.paymentInstructions?.currency || 'KES'} {submitResult.paymentInstructions?.amount || 500}</span> commitment fee via M-Pesa to {submitResult.paymentInstructions?.paybillNumber || 'Paybill details provided on WhatsApp'} ({submitResult.paymentInstructions?.accountNumber}).
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-mint font-bold">3.</span>
                Ensure GitHub account is active.
              </li>
              <li className="flex items-start gap-3">
                <span className="text-brand-mint font-bold">4.</span>
                Clear your Monday & Saturday evenings.
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="https://wa.me/254794939181" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-brand-mint text-brand-dark font-bold rounded-xl hover:bg-brand-mint/90 transition-colors">
              💬 WhatsApp Us
            </a>
            <button
              type="button"
              onClick={handlePaymentNotification}
              disabled={paymentNoticeState === 'loading' || paymentNoticeState === 'sent'}
              className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentNoticeState === 'loading' ? 'Recording...' : paymentNoticeState === 'sent' ? 'Payment Noted' : 'I Have Sent the Payment'}
            </button>
            <Link to="/" className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 px-4 pb-24">
      <Helmet>
        <title>Apply to Cohort 1 | PataSpace Academy</title>
      </Helmet>

      {/* Progress Bar */}
      <div className="mb-10">
          <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -z-10 w-full h-1 bg-white/10 -translate-y-1/2"></div>
          <div 
            className="absolute left-0 top-1/2 -z-10 h-1 bg-brand-mint -translate-y-1/2 transition-all duration-300"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          
          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${currentStep >= step.id ? 'bg-brand-mint border-brand-mint text-brand-dark shadow-[0_0_15px_rgba(2,195,154,0.4)]' : 'bg-brand-dark border-white/20 text-white/50'}`}>
                {currentStep > step.id ? <CheckCircle2 className="w-5 h-5" /> : step.id}
              </div>
              <span className={`absolute top-12 text-xs font-sans whitespace-nowrap hidden sm:block ${currentStep >= step.id ? 'text-brand-mint font-bold' : 'text-white/40'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-card border border-white/10 rounded-3xl p-6 sm:p-10 shadow-xl">
        <h2 className="text-3xl font-heading font-bold mb-8 text-white">{steps[currentStep - 1].name}</h2>
        
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          
          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2">Full Name *</label>
                  <input {...register('fullName')} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint transition-all" placeholder="John Doe" />
                  {errors.fullName && <p className="text-red-400 text-xs mt-1 font-sans">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2">Phone Number *</label>
                  <input {...register('phoneNumber')} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint transition-all" placeholder="0712345678" />
                  {errors.phoneNumber && <p className="text-red-400 text-xs mt-1 font-sans">{errors.phoneNumber.message}</p>}
                  <p className="text-white/40 text-xs mt-1">Used for M-Pesa & WhatsApp.</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2">Email Address *</label>
                  <input type="email" {...register('email')} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint transition-all" placeholder="john@example.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1 font-sans">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2">GitHub Username *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-white/30 font-mono">github.com/</span>
                    <input {...register('githubUsername')} className="w-full bg-black/30 border border-white/10 rounded-xl pl-[104px] pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint transition-all font-mono" placeholder="username" />
                  </div>
                  {errors.githubUsername && <p className="text-red-400 text-xs mt-1 font-sans">{errors.githubUsername.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-white/80 mb-2">Current Level of Study *</label>
                <select {...register('currentLevelOfStudy')} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint appearance-none">
                  <option value="">Select Level</option>
                  <option value="1st Year University">1st Year University</option>
                  <option value="2nd Year University">2nd Year University</option>
                  <option value="3rd Year University">3rd Year University</option>
                  <option value="4th Year University">4th Year University</option>
                  <option value="Recent Graduate">Recent Graduate</option>
                  <option value="Working Professional">Working Professional</option>
                  <option value="High School Leaver">High School Leaver</option>
                  <option value="Other">Other</option>
                </select>
                {errors.currentLevelOfStudy && <p className="text-red-400 text-xs mt-1 font-sans">{errors.currentLevelOfStudy.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-white/80 mb-2">University / Institution (Optional)</label>
                <input {...register('institution')} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-brand-mint transition-all" placeholder="e.g. Kirinyaga University" />
              </div>

              <div>
                <label className="block text-sm font-bold text-white/80 mb-2">Device Available *</label>
                <select {...register('device')} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint appearance-none">
                  <option value="">Select Device</option>
                  <option value="Laptop Windows">Laptop Windows</option>
                  <option value="Laptop Mac">Laptop Mac</option>
                  <option value="Laptop Linux">Laptop Linux</option>
                  <option value="Desktop PC">Desktop PC</option>
                  <option value="I don't have a laptop yet">I don't have a laptop yet</option>
                </select>
                {errors.device && <p className="text-red-400 text-xs mt-1 font-sans">{errors.device.message}</p>}
                <p className="text-brand-gold text-xs mt-1 font-sans">A laptop or desktop is required. Phone only is not sufficient.</p>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div>
                <label className="block text-xl font-heading font-bold text-white mb-4">Select Your Track *</label>
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { id: 'backend', name: 'Backend', icon: '⚙️', color: 'border-brand-teal text-brand-teal' },
                    { id: 'frontend', name: 'Frontend', icon: '🌐', color: 'border-brand-mint text-brand-mint' },
                    { id: 'both', name: 'Full Stack', icon: '⚙️🌐', color: 'border-brand-gold text-brand-gold' }
                  ].map(track => (
                    <label key={track.id} className={`cursor-pointer rounded-2xl border-2 p-4 text-center transition-all ${formValues.selectedTrack === track.id ? `${track.color} bg-white/5` : 'border-white/10 text-white/50 hover:border-white/30'}`}>
                      <input type="radio" value={track.id} {...register('selectedTrack')} className="hidden" />
                      <div className="text-3xl mb-2">{track.icon}</div>
                      <div className="font-bold font-sans">{track.name}</div>
                    </label>
                  ))}
                </div>
                {errors.selectedTrack && <p className="text-red-400 text-xs mt-2 font-sans">{errors.selectedTrack.message}</p>}
                
                {formValues.selectedTrack === 'both' && (
                  <div className="mt-4 p-4 border border-brand-gold/50 bg-brand-gold/10 rounded-xl text-brand-gold text-sm font-sans flex items-start gap-3">
                    <User className="w-5 h-5 shrink-0" />
                    <p>Full Stack is intensive (KES 800/month, 4 sessions/week). Submitting implies you want to enroll in both, pending discussion with Sam.</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xl font-heading font-bold text-white mb-4">Coding Experience *</label>
                <div className="space-y-3">
                  {[
                    { id: 'zero', title: 'Complete Beginner', desc: 'Never written code before.' },
                    { id: 'some', title: 'Some Exposure', desc: 'Watched tutorials, no real projects.' },
                    { id: 'basic', title: 'Basic Skills', desc: 'School basics, some HTML/CSS/Python scripts.' },
                    { id: 'intermediate', title: 'Intermediate', desc: 'Built 1-2 projects, understands logic/functions.' }
                  ].map(exp => (
                    <label key={exp.id} className={`flex items-start p-4 rounded-xl border-2 cursor-pointer transition-all ${formValues.experienceLevel === exp.id ? 'border-brand-mint bg-brand-mint/5' : 'border-white/10 hover:border-white/30'}`}>
                      <div className="flex h-6 items-center">
                        <input type="radio" value={exp.id} {...register('experienceLevel')} className="w-4 h-4 text-brand-mint bg-black/50 border-white/30 rounded focus:ring-brand-mint focus:ring-1" />
                      </div>
                      <div className="ml-3">
                        <span className="block text-sm font-bold text-white">{exp.title}</span>
                        <span className="block text-sm text-white/50">{exp.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.experienceLevel && <p className="text-red-400 text-xs mt-2 font-sans">{errors.experienceLevel.message}</p>}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
              <div>
                <label className="flex justify-between items-baseline mb-2">
                  <span className="text-sm font-bold text-white/80">Motivation *</span>
                  <span className={`text-xs font-mono font-bold ${motivationWordCount >= 50 ? 'text-brand-mint' : 'text-brand-gold'}`}>
                    Words: {motivationWordCount} / 50 min
                  </span>
                </label>
                <textarea {...register('motivation')} rows="5" className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white placeholder-white/30 focus:outline-none focus:border-brand-mint transition-all" placeholder="Why do you want to join PataSpace Academy? Be specific – what problem are you solving, what do you want to build, why now?" />
                {errors.motivation && <p className="text-red-400 text-xs mt-1 font-sans">{errors.motivation.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-white/80 mb-2">What do you want to build / become in the next 2 years? (Optional)</label>
                <textarea {...register('vision')} rows="3" className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-mint transition-all" />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2">Referral Source</label>
                  <select {...register('referralSource')} className="w-full bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-mint">
                    <option value="">How did you hear about us?</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Friend">Friend</option>
                    <option value="Social Media">Social Media</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Sam Muriithi">Sam Muriithi</option>
                    <option value="Campus">Campus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-white/80 mb-2">Attendance Constraints (Optional)</label>
                  <input {...register('attendanceConstraints')} className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-mint transition-all" placeholder="e.g., Classes on Mon 7PM" />
                </div>
              </div>

              <div className="border border-white/10 rounded-2xl p-6 bg-white/5 space-y-4 mt-8">
                <h3 className="font-bold text-brand-mint font-heading mb-4 border-b border-white/10 pb-2">Agreements</h3>
                {[
                  { id: 'agreedToLaptop', label: 'I confirm I have access to a laptop/desktop for the program duration.' },
                  { id: 'agreedToAttendance', label: 'I commit to attending ≥75% of sessions and communicating absences in advance.' },
                  { id: 'agreedToGitHub', label: 'I understand that all assignments are submitted via GitHub Pull Requests.' },
                  { id: 'agreedToFees', label: 'I understand that the KES 500 commitment fee is non-refundable and monthly fees apply.' },
                  { id: 'agreedToTerms', label: 'I have read and agree to the PataSpace Academy Terms of Service.' }
                ].map(checkbox => (
                  <label key={checkbox.id} className="flex items-start gap-4 cursor-pointer group">
                    <div className="pt-1">
                       <input type="checkbox" {...register(checkbox.id)} className="w-5 h-5 accent-brand-mint cursor-pointer" />
                    </div>
                    <div className="flex-1">
                      <span className={`text-sm ${formValues[checkbox.id] ? 'text-white' : 'text-white/60 group-hover:text-white transition-colors'}`}>{checkbox.label}</span>
                      {errors[checkbox.id] && <p className="text-red-400 text-xs mt-1">{errors[checkbox.id]?.message}</p>}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="border border-white/10 bg-black/20 p-6 rounded-2xl">
                <h3 className="text-xl font-heading font-bold mb-6 text-brand-mint border-b border-brand-mint/20 pb-2">Review Your Application</h3>
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                  <div><span className="text-white/50 block">Full Name:</span> <span className="font-bold text-white">{formValues.fullName}</span></div>
                  <div><span className="text-white/50 block">Phone:</span> <span className="font-bold text-white">{formValues.phoneNumber}</span></div>
                  <div><span className="text-white/50 block">Email:</span> <span className="font-bold text-white">{formValues.email}</span></div>
                  <div><span className="text-white/50 block">GitHub:</span> <span className="font-mono text-white">@{formValues.githubUsername}</span></div>
                  <div><span className="text-white/50 block">Level of Study:</span> <span className="text-white">{formValues.currentLevelOfStudy}</span></div>
                  <div><span className="text-white/50 block">Device:</span> <span className="text-white">{formValues.device}</span></div>
                  <div><span className="text-white/50 block">Track:</span> <span className="font-bold text-brand-teal uppercase">{formValues.selectedTrack}</span></div>
                  <div><span className="text-white/50 block">Experience:</span> <span className="uppercase text-white/80">{formValues.experienceLevel}</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/5">
                   <span className="text-white/50 block mb-1 text-sm">Motivation snippet:</span>
                   <p className="text-white/80 text-sm italic">"{formValues.motivation?.substring(0, 100)}..."</p>
                </div>
              </div>

              <div className="bg-brand-teal/10 border border-brand-teal/30 p-6 rounded-2xl">
                <h3 className="font-bold text-white font-heading mb-4">What happens after you submit?</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-white/70">
                  <li>We review your application within 24h and confirm via WhatsApp.</li>
                  <li>You receive M-Pesa payment instructions for the KES 500 commitment fee.</li>
                  <li>After payment confirmation, you're added to the Cohort 1 WhatsApp group.</li>
                  <li>You attend a 30-min orientation session before April 27th.</li>
                  <li className="font-bold text-white">April 27th – Cohort 1 begins.</li>
                </ol>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-8 border-t border-white/10 mt-8">
            {currentStep > 1 ? (
              <button 
                type="button" 
                onClick={prevStep}
                className="flex items-center font-bold px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back
              </button>
            ) : <div></div>}

            {currentStep < steps.length ? (
              <button 
                type="button" 
                onClick={validateStep}
                className="flex items-center font-bold px-8 py-3 rounded-xl bg-brand-mint text-brand-dark hover:bg-brand-mint/90 transition-transform active:scale-95"
              >
                Next
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex items-center font-bold px-10 py-4 rounded-xl bg-gradient-to-r from-brand-teal to-brand-mint text-brand-dark hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(30,150,252,0.3)]"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <>
                    Submit Application
                    <CheckSquare className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default ApplicationWizard;
