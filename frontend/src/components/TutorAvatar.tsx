import { useState } from 'react';

import { cn } from '@/lib/utils';

interface TutorAvatarProps {
  /** 头像渐变色对 [起始色, 结束色]，图片加载前的兜底 */
  gradient: [string, string];
  initial: string;
  /** 真人头像图片地址，传入后优先展示图片 */
  src?: string;
  /** 像素尺寸，默认 56 */
  size?: number;
  online?: boolean;
  className?: string;
}

export default function TutorAvatar({
  gradient,
  initial,
  src,
  size = 56,
  online = false,
  className,
}: TutorAvatarProps) {
  // 图片加载失败时回退为渐变底 + 首字（子路径部署 / 断网兜底）
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = src && !imgFailed;

  return (
    <div className={cn('relative shrink-0', className)} style={{ width: size, height: size }}>
      <div
        className="w-full h-full rounded-full flex items-center justify-center text-white font-bold shadow-md overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          fontSize: Math.round(size * 0.36),
        }}
      >
        {showImg ? (
          <img
            src={src}
            alt={initial}
            className="w-full h-full object-cover"
            loading="lazy"
            draggable={false}
            onError={() => setImgFailed(true)}
          />
        ) : (
          initial
        )}
      </div>
      {online && (
        <span
          className="absolute rounded-full bg-success border-2 border-card"
          style={{ width: Math.round(size * 0.24), height: Math.round(size * 0.24), right: 0, bottom: 0 }}
        />
      )}
    </div>
  );
}
