import React, { useState, useRef } from 'react';
import { Star, X, Loader2, CheckCircle2, User, Camera } from 'lucide-react';
import { cn } from '../../lib/utils';
import { submitProductReview, uploadProductImage, type ProductReview } from '../../services/marketplaceService';

interface ProductReviewFormProps {
  productId: string;
  productTitle: string;
  onSubmitSuccess: (review: ProductReview) => void;
  onCancel: () => void;
}

const RATING_LABELS = ['', 'Needs Work', 'Fair', 'Good', 'Very Good', 'Outstanding!'];

export const ProductReviewForm: React.FC<ProductReviewFormProps> = ({
  productId,
  productTitle,
  onSubmitSuccess,
  onCancel,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (images.length + files.length > 3) {
      setError('Maximum 3 photos allowed per review.');
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const uploaded: string[] = [];
      for (const file of files) {
        try {
          const url = await uploadProductImage(file);
          uploaded.push(url);
        } catch {
          // fallback: use data URL preview
          const dataUrl = await new Promise<string>((res) => {
            const reader = new FileReader();
            reader.onload = (ev) => res(ev.target?.result as string);
            reader.readAsDataURL(file);
          });
          uploaded.push(dataUrl);
        }
      }
      setImages((prev) => [...prev, ...uploaded]);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { setError('Please select a star rating.'); return; }
    if (!author.trim()) { setError('Please enter your name.'); return; }
    if (comment.trim().length < 20) { setError('Review must be at least 20 characters.'); return; }
    setSubmitting(true);
    setError(null);
    try {
      const review = await submitProductReview(productId, {
        rating,
        author: author.trim(),
        role: role.trim() || 'Verified Customer',
        comment: comment.trim(),
        images: images.length > 0 ? images : undefined,
        verifiedPurchase: true,
      });
      setSubmitted(true);
      setTimeout(() => onSubmitSuccess(review), 1500);
    } catch (err: unknown) {
      setError((err as Error)?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-10 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="font-headline font-black text-lg text-slate-900 dark:text-white">Thank you for your review!</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Your feedback helps other families discover the right learning kits.</p>
      </div>
    );
  }

  const displayRating = hoverRating || rating;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
      <div>
        <h3 className="font-headline font-black text-base text-slate-900 dark:text-white mb-1">Write a Review</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Reviewing: <span className="font-semibold">{productTitle}</span></p>
      </div>

      {/* Star Rating Selector */}
      <div>
        <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-2">Your Rating *</label>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform hover:scale-125 active:scale-95 cursor-pointer"
              aria-label={`Rate ${star} out of 5 stars`}
            >
              <Star
                className={cn(
                  'w-8 h-8 transition-colors',
                  star <= displayRating
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-300 dark:text-slate-600'
                )}
              />
            </button>
          ))}
          {displayRating > 0 && (
            <span className="ml-2 text-sm font-headline font-bold text-amber-500">
              {RATING_LABELS[displayRating]}
            </span>
          )}
        </div>
      </div>

      {/* Author Name & Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">Your Name *</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Fatima B."
              className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">Your Role</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Parent of 8yo, Educator"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5]"
          />
        </div>
      </div>

      {/* Review Comment */}
      <div>
        <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-1">Your Review *</label>
        <textarea
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience — how did your child engage with this kit? What skills did you notice developing?"
          className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-body text-xs focus:outline-none focus:ring-2 focus:ring-[#016ba5] resize-none"
        />
        <p className={cn('text-[10px] mt-1', comment.length >= 20 ? 'text-emerald-500' : 'text-slate-400')}>
          {comment.length}/20 minimum characters
        </p>
      </div>

      {/* Photo Attachments */}
      <div>
        <label className="block text-xs font-headline font-bold text-slate-700 dark:text-slate-200 mb-2">Photos (optional, up to 3)</label>
        <div className="flex items-center gap-2 flex-wrap">
          {images.map((img, idx) => (
            <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group">
              <img src={img} alt={`Review photo ${idx + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                aria-label="Remove photo"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:border-[#016ba5] hover:text-[#016ba5] transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Add review photo"
            >
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
              {!uploading && <span className="text-[9px] mt-0.5">Add Photo</span>}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleImageUpload}
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#016ba5] hover:bg-[#015786] text-white font-headline font-bold text-sm transition-all active:scale-95 disabled:opacity-60 cursor-pointer"
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Star className="w-4 h-4 fill-white" />}
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-headline font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProductReviewForm;
