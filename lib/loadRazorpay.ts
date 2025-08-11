export async function loadRazorpaySdk(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if ((window as any).Razorpay) return (window as any).Razorpay;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve((window as any).Razorpay);
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
}


