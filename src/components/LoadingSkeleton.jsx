export default function LoadingSkeleton({ label, cards = 1 }) {
  return <div className="loading-skeleton" role="status" aria-label={label}>
    <span className="visually-hidden">{label}</span>
    <div className="loading-skeleton-grid" aria-hidden="true">
      {Array.from({ length: cards }, (_, index) => <div className="loading-skeleton-card" key={index}><span /><span /><span /></div>)}
    </div>
  </div>
}
