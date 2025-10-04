export const getImageUrl = (event, baseUrl = 'https://nextgen-events-backend-b34m.onrender.com') => {
  const banner = event?.imageUrl || event?.banner || event?.bannerUrl;
  
  if (!banner) {
    return 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80';
  }
  
  if (banner.startsWith('http://') || banner.startsWith('https://')) {
    return banner;
  } else {
    const cleanPath = banner.startsWith('/') ? banner.substring(1) : banner;
    return `${baseUrl}/${cleanPath.replace(/\\/g, '/')}`;
  }
};

export const isValidImageUrl = (url) => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const urlLower = url.toLowerCase();
  
  return imageExtensions.some(ext => 
    urlLower.includes(ext) || 
    urlLower.includes('image') || 
    urlLower.includes('photo') ||
    urlLower.includes('pic')
  );
};

export const checkImageLoad = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
};