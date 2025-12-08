
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle, ArrowRight } from 'lucide-react';
import { AnimatedInput, AnimatedTextArea, AnimatedPhoneInput } from './profile/ProfileFormElements';
import PremiumButton from './ui/PremiumButton';
import { validateField } from '../utils/validation';

const ContactSection: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+91',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (validateField('fullName', formData.name)) newErrors.name = validateField('fullName', formData.name)!;
    if (validateField('email', formData.email)) newErrors.email = validateField('email', formData.email)!;
    if (validateField('phone', formData.phone, formData.phoneCode)) newErrors.phone = validateField('phone', formData.phone, formData.phoneCode)!;
    if (validateField('message', formData.message)) newErrors.message = validateField('message', formData.message)!;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const fieldNameForValidation = name === 'name' ? 'fullName' : name;
    const error = validateField(fieldNameForValidation, value);
    
    if (error) {
       setErrors(prev => ({ ...prev, [name]: error }));
    } else {
       setErrors(prev => {
         const newErrors = { ...prev };
         delete newErrors[name];
         return newErrors;
       });
    }
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name } = e.target;
      setTouched(prev => ({ ...prev, [name]: true }));
      const fieldNameForValidation = name === 'name' ? 'fullName' : name;
      const error = validateField(fieldNameForValidation, formData[name as keyof typeof formData]);
      if (error) setErrors(prev => ({ ...prev, [name]: error }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', phoneCode: '+91', message: '' });
      setTimeout(() => setFormStatus('idle'), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      details: "+91 98765 43210",
      subDetails: "Mon-Sat, 9AM - 7PM",
      action: "tel:+919876543210",
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      icon: <Mail size={24} />,
      title: "Email Support",
      details: "help@divinematrimony.com",
      subDetails: "24/7 Response Time",
      action: "mailto:help@divinematrimony.com",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      icon: <MapPin size={24} />,
      title: "Head Office",
      details: "T-Nagar, Chennai",
      subDetails: "Tamil Nadu, India - 600017",
      action: "#map",
      color: "text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-900/20"
    }
  ];

  return (
    <section id="contact" className="py-24 relative z-10">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-purple-600 dark:text-gold-400 font-bold tracking-widest uppercase text-sm"
          >
            Get in Touch
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-gray-900 dark:text-white mt-4 mb-6"
          >
            We're Here to Help
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Have questions about our premium matchmaking services? Reach out to our dedicated support team.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Contact Info Cards & Map */}
          <div className="space-y-8">
            {contactInfo.map((info, idx) => (
              <motion.a
                key={idx}
                href={info.action}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex items-center gap-6 p-6 rounded-[2rem] bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-xl hover:bg-white dark:hover:bg-white/10 hover:scale-[1.02] hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${info.bg} ${info.color} group-hover:scale-110 transition-transform duration-300`}>
                  {info.icon}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-gold-400 transition-colors">
                    {info.title}
                  </h4>
                  <p className="text-lg font-medium text-gray-700 dark:text-gray-200">{info.details}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{info.subDetails}</p>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-400 group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent transition-all">
                  <ArrowRight size={18} />
                </div>
              </motion.a>
            ))}

            {/* Embedded Google Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="h-72 rounded-[2rem] overflow-hidden border border-gray-200 dark:border-white/10 shadow-xl relative group"
            >
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248879.05335371653!2d79.93052299157551!3d12.924732821533869!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5266e6aeb06687%3A0xb442740624579dd4!2sAsana%20Andiappan%20Yoga%20Centre!5e0!3m2!1sen!2sin!4v1765198715362!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              
              {/* Overlay Label */}
              <div className="absolute bottom-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold shadow-lg pointer-events-none text-gray-900 dark:text-white flex items-center gap-2">
                 <MapPin size={14} className="text-red-500" /> Locate Us on Map
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-[2.5rem] opacity-20 blur-xl" />
            
            <div className="relative bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/50 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Send us a Message</h3>
              
              <AnimatePresence mode="wait">
                {formStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h4>
                    <p className="text-gray-500 dark:text-gray-400">Our team will get back to you within 24 hours.</p>
                  </motion.div>
                ) : (
                  <motion.form 
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    noValidate
                  >
                    <div className="space-y-2">
                      <AnimatedInput 
                        name="name"
                        label="Full Name" 
                        alphaOnly
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.name ? errors.name : undefined}
                        isValid={!errors.name && !!formData.name}
                      />
                      <AnimatedInput 
                        name="email"
                        label="Email Address" 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.email ? errors.email : undefined}
                        isValid={!errors.email && !!formData.email}
                      />
                      <AnimatedPhoneInput 
                         label="Mobile Number"
                         countryCode={formData.phoneCode}
                         value={formData.phone}
                         onCountryCodeChange={(c) => setFormData(prev => ({...prev, phoneCode: c}))}
                         onPhoneChange={(p) => setFormData(prev => ({...prev, phone: p}))}
                         error={touched.phone ? errors.phone : undefined}
                         onBlur={() => {
                            setTouched(prev => ({...prev, phone: true}));
                            const err = validateField('phone', formData.phone, formData.phoneCode);
                            if(err) setErrors(prev => ({...prev, phone: err}));
                         }}
                      />
                      <AnimatedTextArea 
                        name="message"
                        label="Your Message" 
                        placeholder="How can we help you?" 
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.message ? errors.message : undefined}
                        isValid={!errors.message && !!formData.message}
                      />
                    </div>

                    <div className="pt-4">
                      <PremiumButton 
                         width="full" 
                         variant="gradient" 
                         disabled={formStatus === 'submitting'}
                         icon={formStatus === 'submitting' ? <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Send size={18} />}
                      >
                        {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                      </PremiumButton>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
