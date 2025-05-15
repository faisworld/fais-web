import Image from 'next/image';

// Find the Image component using the black logo and update it:

<Image 
  src="https://mzcje1drftvqhdku.public.blob.vercel-storage.com/images/1746460117071-logo-fais-black.png"
  alt="FAIS Logo"
  width={140}
  height={0}  // Set to 0 if you only want to specify width
  style={{ height: 'auto' }}  // Add this line to maintain aspect ratio
  className="logo"
/>
