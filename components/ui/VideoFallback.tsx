'use client';

/**
 * Interface for VideoFallback props
 */
interface VideoFallbackProps {
  title?: string;
  description?: string;
}

/**
 * Fallback component to display when videos fail to load
 * Renders a static image with service information instead of a video
 */
export default function VideoFallback({ title, description }: VideoFallbackProps) {
  return (
    <div className="services-video-container" style={{ backgroundColor: '#0f172a' }}>
      <div className="services-video-overlay" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <div className="services-video-content">
          <h1 className="services-video-title">
            {title || 'Our Services'}
          </h1>
          <p className="services-video-description">
            {description || 'Delivering innovative solutions that transform businesses for the digital era'}
          </p>
          
          {/* Visual elements to replace video */}
          <div className="services-visual-elements">
            <div className="services-icon-grid">
              <div className="services-icon">AI</div>
              <div className="services-icon">Web3</div>
              <div className="services-icon">Apps</div>
              <div className="services-icon">Cloud</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
