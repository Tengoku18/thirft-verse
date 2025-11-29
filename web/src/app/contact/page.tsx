'use client';

import { createTicket } from '@/actions/tickets';
import Button from '@/_components/common/Button';
import PageLayout from '@/_components/common/PageLayout';
import { FormInput, FormTextarea } from '@/_components/forms';
import { uploadTicketAttachments } from '@/lib/storage/tickets';
import { ContactFormData, contactSchema } from '@/lib/validations/contact';
import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, MessageCircle, Paperclip, Phone, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: yupResolver(contactSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    const validFiles = newFiles.filter((file) => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        return false;
      }
      // Check file type (images only)
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        return false;
      }
      return true;
    });

    // Limit to 3 attachments
    if (attachments.length + validFiles.length > 3) {
      toast.error('You can only attach up to 3 images.');
      return;
    }

    setAttachments((prev) => [...prev, ...validFiles]);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsUploading(true);
      let attachmentUrls: string[] = [];

      // Upload attachments if any
      if (attachments.length > 0) {
        const uploadResult = await uploadTicketAttachments(attachments);

        // Show individual upload errors
        if (uploadResult.errors.length > 0) {
          uploadResult.errors.forEach((error) => toast.error(error));
        }

        // If all uploads failed, don't proceed with ticket creation
        if (attachments.length > 0 && uploadResult.urls.length === 0) {
          toast.error(
            'All attachment uploads failed. Please try again or submit without attachments.'
          );
          setIsUploading(false);
          return;
        }

        // Warn if some uploads failed but continue
        if (uploadResult.partialSuccess) {
          toast(
            `${uploadResult.urls.length} of ${attachments.length} attachments uploaded successfully.`,
            { icon: '⚠️' }
          );
        }

        attachmentUrls = uploadResult.urls;
      }

      // Create the ticket
      const result = await createTicket({
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
        attachments: attachmentUrls,
      });

      if (result.success) {
        toast.success(
          'We received your concern and will reach out to you soon!',
          {
            duration: 5000,
          }
        );
        reset();
        setAttachments([]);
      } else {
        toast.error(result.error || 'Failed to submit your request.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageLayout
      title="Contact Us"
      description="Get in touch with our team. We're here to help you succeed."
    >
      <div className="py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="font-heading mb-6 text-2xl font-bold text-primary">
              Send us a message
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormInput
                {...register('full_name')}
                label="Full Name"
                placeholder="Enter your full name"
                error={errors.full_name?.message}
                required
              />

              <FormInput
                {...register('email')}
                type="email"
                label="Email Address"
                placeholder="your@email.com"
                error={errors.email?.message}
                required
              />

              <FormInput
                {...register('phone')}
                type="tel"
                label="Phone Number"
                placeholder="9876543210"
                error={errors.phone?.message}
                required
              />

              <FormInput
                {...register('subject')}
                label="Subject"
                placeholder="How can we help?"
                error={errors.subject?.message}
                required
              />

              <FormTextarea
                {...register('message')}
                label="Message"
                placeholder="Tell us more about your question or concern..."
                rows={6}
                error={errors.message?.message}
                required
              />

              {/* File Attachments */}
              <div>
                <label className="mb-2 block text-sm font-medium text-primary">
                  Attachments{' '}
                  <span className="text-primary/50">(Optional, max 3 images)</span>
                </label>

                {/* Attachment Preview */}
                {attachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="group relative flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
                      >
                        <span className="max-w-[150px] truncate text-sm text-primary">
                          {file.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="rounded-full p-0.5 text-primary/50 transition-colors hover:bg-red-100 hover:text-red-500"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="attachments"
                />
                <label
                  htmlFor="attachments"
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface/50 px-4 py-4 text-sm text-primary/70 transition-colors hover:border-secondary hover:bg-surface ${
                    attachments.length >= 3 ? 'cursor-not-allowed opacity-50' : ''
                  }`}
                >
                  <Paperclip className="h-5 w-5" />
                  <span>
                    {attachments.length >= 3
                      ? 'Maximum attachments reached'
                      : 'Click to attach images'}
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? 'Submitting...' : 'Send Message'}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="font-heading mb-6 text-2xl font-bold text-primary">
              Other ways to reach us
            </h2>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg">
                <div className="rounded-full bg-secondary/10 p-3">
                  <Mail className="h-6 w-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-heading mb-1 text-lg font-bold text-primary">
                    Email Support
                  </h3>
                  <p className="mb-2 text-sm text-primary/70">
                    We&apos;ll respond within 24 hours
                  </p>
                  <a
                    href="mailto:thriftverse.shop@gmail.com"
                    className="text-secondary hover:underline"
                  >
                    thriftverse.shop@gmail.com
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 rounded-xl border border-border bg-surface p-6 transition-all hover:shadow-lg">
                <div className="rounded-full bg-accent-2/10 p-3">
                  <Phone className="h-6 w-6 text-accent-2" />
                </div>
                <div>
                  <h3 className="font-heading mb-1 text-lg font-bold text-primary">
                    Phone Support
                  </h3>
                  <p className="mb-2 text-sm text-primary/70">
                    Mon-Fri, 9am-6pm NPT
                  </p>
                  <a
                    href="tel:+9779849975282"
                    className="text-secondary hover:underline"
                  >
                    +977 981*****19
                  </a>
                </div>
              </div>

              {/* Live Chat - Coming Soon */}
              <div className="relative overflow-hidden rounded-xl border border-border bg-surface">
                <div className="pointer-events-none flex select-none items-start gap-4 p-6 blur-[2px]">
                  <div className="rounded-full bg-accent-1/10 p-3">
                    <MessageCircle className="h-6 w-6 text-accent-1" />
                  </div>
                  <div>
                    <h3 className="font-heading mb-1 text-lg font-bold text-primary">
                      Live Chat
                    </h3>
                    <p className="mb-2 text-sm text-primary/70">
                      Chat with our team in real-time
                    </p>
                    <span className="text-secondary">Start a conversation</span>
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-background/30">
                  <span className="rounded-full bg-primary/90 px-4 py-1.5 text-sm font-semibold text-white">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="mt-8 rounded-xl bg-gradient-to-br from-secondary/10 to-accent-2/10 p-6">
              <h3 className="font-heading mb-2 text-lg font-bold text-primary">
                Average Response Time
              </h3>
              <p className="text-sm text-primary/70">
                We typically respond to all inquiries within 24 hours. For
                urgent matters, please call us directly during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
