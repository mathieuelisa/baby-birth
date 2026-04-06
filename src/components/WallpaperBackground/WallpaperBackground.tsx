import Image from "next/image";

export default function WallpaperBackground() {
  return (
    <div className='absolute inset-0 -z-0'>
      <Image
        src='/assets/images/wallpaper.jpg'
        alt='wallpaper'
        fill
        priority
        className='object-cover'
      />

      <div className='absolute inset-0'>
        <Image
          src='/assets/images/wallpaper.jpg'
          alt='wallpaper duplicate'
          fill
          priority
          className='scale-110 object-cover blur-sm'
        />
      </div>

      <div className='absolute inset-0 bg-black/30' />
    </div>
  );
}
