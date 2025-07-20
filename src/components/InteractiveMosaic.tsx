interface InteractiveMosaicProps {
    imageUrl: string;
    width? : string;
    height? : string;
    className? : string
}

export default function InteractiveMosaic({ 
    imageUrl, 
    width = "100%", 
    height,
    className = ""
  } : InteractiveMosaicProps) {
    const iframeSrc = `/p5sketches/mosaic-picture-hover/index.html?image=${encodeURIComponent(imageUrl)}`
    
    return (
      <iframe
        src={iframeSrc}
        width={width}
        {...(height && { height })}
        scrolling="no"
        style={{ border: 'none', overflow: 'hidden'}}
        className={className}
        title="Mosaic Shader Effect"
      />
    )
  }